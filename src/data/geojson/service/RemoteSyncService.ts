/**
 * RemoteSyncService
 *
 * R2 Worker Proxy からリモート GeoJSON データを取得し、SQLite キャッシュと同期する。
 * AssetRestoreService と同様のパターンで実装し、既存インフラ（fetchJsonWithRetry,
 * GeojsonRepository, sha256）を利用する。
 *
 * フロー: checkForUpdates → planSync → executeSync → cleanupOrphans
 */

import type { FeatureCollection } from "geojson";
import { GeojsonRepository } from "@/src/data/geojson/repository/GeojsonRepository";
import {
  fetchJsonWithRetry,
  fetchTextWithRetry,
} from "@/src/infra/network/fetchJson";
import { sha256 } from "@/src/infra/sha256/hashCheck";
import { parseJson } from "@/src/infra/jsonParse/jsonParser";
import type { BuildManifest, LocalManifest } from "@/src/domain/manifestTypes";
import { QuotaExceededError } from "@/src/domain/NetworkErrors";
import { VERSION_URL, MANIFEST_URL, geojsonUrl } from "@/src/config/remote";

/** version.json の型 */
type RemoteVersionInfo = {
  version: string;
  manifestSha256: string;
  manifestSize: number;
};

/** 同期計画 */
export type SyncPlan = {
  add: string[];
  update: string[];
  delete: string[];
};

export class RemoteSyncService {
  private repo: GeojsonRepository;

  constructor(repo?: GeojsonRepository) {
    this.repo = repo ?? GeojsonRepository.getInstance();
  }

  // ----------------------------------------------------------------
  // Public API
  // ----------------------------------------------------------------

  /**
   * リモートの version.json とローカルキャッシュのバージョンを比較する。
   * ネットワークエラー時は false を返し throw しない。
   */
  async checkForUpdates(): Promise<boolean> {
    let remoteVersion: RemoteVersionInfo | null;
    try {
      remoteVersion = await fetchJsonWithRetry<RemoteVersionInfo>(VERSION_URL);
    } catch (e) {
      if (e instanceof QuotaExceededError) {
        // クォータ超過は上位で特別扱いするため再スロー
        throw e;
      }
      console.warn("[RemoteSync] checkForUpdates: network error", e);
      return false;
    }

    if (!remoteVersion) {
      console.warn("[RemoteSync] checkForUpdates: version.json not found");
      return false;
    }

    const localManifest = await this.repo.getLocalManifest();
    if (!localManifest || !localManifest.version) {
      // ローカルにデータがない → 更新必要
      return true;
    }

    const needsUpdate = localManifest.version !== remoteVersion.version;
    console.log(
      `[RemoteSync] Local v=${localManifest.version}, Remote v=${remoteVersion.version} → ${needsUpdate ? "update needed" : "up to date"}`,
    );
    return needsUpdate;
  }

  /**
   * リモートマニフェストとローカルマニフェストをファイル単位の sha256 で比較し、
   * 同期計画（追加・更新・削除）を返す。
   *
   * @param remoteManifest - R2 から取得した BuildManifest
   */
  async planSync(remoteManifest: BuildManifest): Promise<SyncPlan> {
    const localManifest = await this.repo.getLocalManifest();
    const localFiles = localManifest?.files ?? {};

    const remoteIds = new Set(Object.keys(remoteManifest.files));
    const localIds = new Set(Object.keys(localFiles));

    const add: string[] = [];
    const update: string[] = [];

    for (const id of remoteIds) {
      const remoteItem = remoteManifest.files[id];
      const localItem = localFiles[id];

      if (!localItem) {
        // ローカルに存在しない → 追加対象
        add.push(id);
      } else if (localItem.sha256 && localItem.sha256 !== remoteItem.sha256) {
        // sha256 が異なる → 更新対象
        update.push(id);
      }
      // sha256 が一致する → スキップ
    }

    // 削除対象: ローカルに存在するがリモートに存在しない source='remote' のファイル
    const deleteCandidates = [...localIds].filter((id) => !remoteIds.has(id));
    const deleteList: string[] = [];

    for (const id of deleteCandidates) {
      const source = await this.repo.getSource(id);
      if (source === "remote") {
        deleteList.push(id);
      }
    }

    return { add, update, delete: deleteList };
  }

  /**
   * 同期計画に従って R2 からファイルをダウンロード・検証・格納する。
   * 各ファイルは独立して実行され、1 ファイルの失敗が他に影響しない。
   */
  async executeSync(
    plan: SyncPlan,
    version: string,
    remoteManifest: BuildManifest,
  ): Promise<void> {
    const targetIds = [...plan.add, ...plan.update];

    // add/update: ダウンロード → sha256 検証 → upsert
    for (const mapId of targetIds) {
      const item = remoteManifest.files[mapId];
      if (!item) {
        console.warn(
          `[RemoteSync] ${mapId} not found in remote manifest, skipping`,
        );
        continue;
      }

      try {
        const url = geojsonUrl(item.relativePath);
        const text = await fetchTextWithRetry(url);

        if (text === null) {
          console.warn(`[RemoteSync] ${mapId} returned 404 from R2, skipping`);
          await this.repo.recordFailure(mapId, version, "HTTP 404 from R2");
          continue;
        }

        // sha256 検証
        const actualHash = sha256(text);
        if (actualHash !== item.sha256) {
          console.warn(
            `[RemoteSync] sha256 mismatch for ${mapId}: expected ${item.sha256}, got ${actualHash}`,
          );
          await this.repo.recordFailure(
            mapId,
            version,
            `sha256 mismatch: expected ${item.sha256}, got ${actualHash}`,
          );
          continue;
        }

        const data = parseJson<FeatureCollection>(text);
        const sizeBytes = new TextEncoder().encode(text).length;

        await this.repo.upsert(mapId, data, {
          sha256: actualHash,
          size: sizeBytes,
          version,
          source: "remote",
        });

        console.log(
          `[RemoteSync] Synced ${mapId} (${(sizeBytes / 1024).toFixed(1)} KB)`,
        );
      } catch (e) {
        if (e instanceof QuotaExceededError) {
          throw e; // クォータ超過は即座に伝播
        }
        console.warn(`[RemoteSync] Failed to sync ${mapId}:`, e);
        await this.repo.recordFailure(mapId, version, String(e));
        // 1ファイルの失敗は無視して続行
      }
    }

    // delete: source='remote' のエントリを削除
    for (const mapId of plan.delete) {
      try {
        await this.repo.delete(mapId);
        console.log(`[RemoteSync] Deleted ${mapId} (removed from remote)`);
      } catch (e) {
        console.warn(`[RemoteSync] Failed to delete ${mapId}:`, e);
        // 削除失敗は無視して続行
      }
    }
  }

  /**
   * バージョンチェック → マニフェスト比較 → 同期実行 → クリーンアップを一括実行する。
   * エラーは catch してログ出力し、throw しない。
   */
  async syncIfNeeded(): Promise<void> {
    try {
      // Step 1: バージョンチェック
      const needsUpdate = await this.checkForUpdates();
      if (!needsUpdate) return;

      // Step 2: リモートマニフェスト取得
      const remoteManifest =
        await fetchJsonWithRetry<BuildManifest>(MANIFEST_URL);
      if (!remoteManifest) {
        console.warn("[RemoteSync] manifest.json not found, skipping sync");
        return;
      }

      // Step 3: 同期計画策定
      const plan = await this.planSync(remoteManifest);
      console.log(
        `[RemoteSync] Sync plan: +${plan.add.length} ~${plan.update.length} -${plan.delete.length}`,
      );

      if (
        plan.add.length === 0 &&
        plan.update.length === 0 &&
        plan.delete.length === 0
      ) {
        // sha256 が全件一致しているが version だけ異なるケース（稀）
        // バージョンだけ更新して完了
        await this.updateLocalManifestVersion(
          remoteManifest.version,
          remoteManifest,
          plan,
        );
        return;
      }

      // Step 4: 同期実行
      await this.executeSync(plan, remoteManifest.version, remoteManifest);

      // Step 5: ローカルマニフェスト更新
      await this.updateLocalManifestVersion(
        remoteManifest.version,
        remoteManifest,
        plan,
      );

      // Step 6: 孤立エントリクリーンアップ
      const deletedOrphans = await this.repo.cleanupOrphans();
      if (deletedOrphans > 0) {
        console.log(
          `[RemoteSync] Cleaned up ${deletedOrphans} orphaned entries`,
        );
      }

      console.log(
        `[RemoteSync] Sync complete (version ${remoteManifest.version})`,
      );
    } catch (e) {
      if (e instanceof QuotaExceededError) {
        console.warn("[RemoteSync] Sync skipped: quota exceeded");
      } else {
        console.error("[RemoteSync] Sync failed:", e);
      }
    }
  }

  // ----------------------------------------------------------------
  // Private helpers
  // ----------------------------------------------------------------

  /**
   * 同期完了後にローカルマニフェストを更新する。
   * リモートマニフェストのバージョンを採用し、ファイル情報をマージする。
   */
  private async updateLocalManifestVersion(
    version: string,
    remoteManifest: BuildManifest,
    plan: SyncPlan,
  ): Promise<void> {
    const currentLocal = await this.repo.getLocalManifest();
    const mergedFiles: LocalManifest["files"] = {
      ...(currentLocal?.files ?? {}),
    };

    // 削除対象を除去
    for (const mapId of plan.delete) {
      delete mergedFiles[mapId];
    }

    // リモートのファイル情報で上書き（add/update 対象の sha256 が最新）
    for (const [mapId, item] of Object.entries(remoteManifest.files)) {
      mergedFiles[mapId] = {
        relativePath: item.relativePath,
        size: item.size,
        sha256: item.sha256,
      };
    }

    await this.repo.setLocalManifest({
      version,
      files: mergedFiles,
    });
  }
}
