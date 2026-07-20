// geojson データ管理の新しい公開エントリポイント
// SQLite 永続化・ハイブリッド更新戦略・部分成功・クォータ制限対応

import { GeojsonRepository } from "./repository/GeojsonRepository";
import { AssetRestoreService } from "./service/AssetRestoreService";
import { RemoteSyncService } from "./service/RemoteSyncService";
import type { UpdateResult } from "./types";
import type { LocalManifest } from "@/src/domain/manifestTypes";
import { QuotaExceededError } from "@/src/domain/NetworkErrors";
import assetManifest from "@/assets/maps/manifest.json";

export type { UpdateResult } from "./types";

/** クォータ超過状態を外部に通知するためのコールバック型 */
export type QuotaCallback = (exceeded: boolean, message: string) => void;

/** 登録されたクォータ超過コールバック */
let onQuotaExceeded: QuotaCallback | null = null;

/** クォータ超過時のコールバックを登録 */
export function setOnQuotaExceeded(cb: QuotaCallback) {
  onQuotaExceeded = cb;
}

/**
 * GeoJSON データシステムを初期化する。
 */
export async function initializeGeoData(): Promise<void> {
  const repo = GeojsonRepository.getInstance();
  await repo.initialize();

  const deletedOrphans = await repo.cleanupOrphans();
  if (deletedOrphans > 0) {
    console.log(`[GeoJsonInit] Cleaned up ${deletedOrphans} orphaned entries`);
  }

  const localManifest = await repo.getLocalManifest();

  if (!localManifest || Object.keys(localManifest.files).length === 0) {
    console.log("[GeoJsonInit] First launch: restoring from assets");
    const assetService = new AssetRestoreService(repo);
    await assetService.restoreFromAssets();
    const manifest = await assetService.buildLocalManifest();
    await repo.setLocalManifest(manifest);
    return;
  }

  console.log(
    `[GeoJsonInit] Cache exists (version: ${localManifest.version}), ready to use`,
  );
}

/**
 * バンドル資産バージョンと SQLite キャッシュを比較し、
 * バンドルが新しい場合のみアセットからリストアする。
 */
export async function checkAndUpdate(): Promise<UpdateResult[]> {
  const repo = GeojsonRepository.getInstance();
  const localManifest = await repo.getLocalManifest();
  const bundleVersion = (assetManifest as { version: string }).version;

  // バンドルバージョンと SQLite バージョンが一致していれば更新不要
  if (localManifest && localManifest.version === bundleVersion) {
    console.log("[GeoJsonInit] Bundle version matches cache, no update needed");
  } else {
    console.log(
      `[GeoJsonInit] Bundle version ${bundleVersion} > cache, restoring from assets`,
    );
    const assetService = new AssetRestoreService(repo);
    const restoredCount = await assetService.restoreFromAssets();
    const manifest = await assetService.buildLocalManifest();
    await repo.setLocalManifest(manifest);

    console.log(
      `[GeoJsonInit] Restored ${restoredCount} files from bundle assets`,
    );
  }

  // R2 リモート同期 (非同期実行、失敗してもブロックしない)
  try {
    const remoteService = new RemoteSyncService(repo);
    await remoteService.syncIfNeeded();
  } catch (e) {
    if (e instanceof QuotaExceededError) {
      console.warn("[GeoJsonInit] R2 sync skipped: quota exceeded");
    } else {
      console.warn("[GeoJsonInit] R2 sync failed, using existing cache:", e);
    }
  }

  return [];
}

export { GeojsonRepository } from "./repository/GeojsonRepository";
export type { UpdatePlan } from "./types";
