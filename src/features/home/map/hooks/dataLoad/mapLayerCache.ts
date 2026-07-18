// マップレイヤ統一キャッシュ
// モジュールスコープで全フロアデータを保持。useRefキャッシュを置き換え。
// SQLite → geoJsonMap の段階的フォールバックを実装。

import type { FeatureCollection } from "geojson";
import type { MapId } from "@/src/data/geojson/geojsonAssetMap";
import { GeojsonRepository } from "@/src/data/geojson/repository/GeojsonRepository";
import { sanitizeFeatureCollection } from "@/src/infra/geojson/sanitizeGeoJSON";
import { geoJsonMap } from "@/src/data/geojson/geojsonAssetMap";

// ---- 型定義 ----

export type FloorCache = {
  readonly surface: FeatureCollection;
  readonly rooms: FeatureCollection;
  readonly underlaySurface: FeatureCollection | null;
};

export type MapLayerCache = {
  readonly venue: FeatureCollection;
  readonly stairs: FeatureCollection;
  readonly floors: Map<number, FloorCache>;
};

// ---- モジュールスコープキャッシュ ----

let cache: MapLayerCache | null = null;
let cacheStatus: "idle" | "loading" | "ready" | "error" = "idle";
let loadPromise: Promise<void> | null = null;

// ---- ID 定数 ----

const ALL_MAP_IDS: MapId[] = [
  "venue_venue",
  "studyhall_stairs",
  "studyhall_surface_1F",
  "studyhall_rooms_1F",
  "studyhall_surface_2F",
  "studyhall_rooms_2F",
  "studyhall_surface_3F",
  "studyhall_rooms_3F",
  "studyhall_surface_4F",
  "studyhall_rooms_4F",
  "studyhall_surface_5F",
  "studyhall_rooms_5F",
] as const;

// ---- 内部ヘルパー ----

function floorSurfaceId(floor: number): MapId {
  return `studyhall_surface_${floor}F` as MapId;
}
function floorRoomsId(floor: number): MapId {
  return `studyhall_rooms_${floor}F` as MapId;
}

/**
 * SQLite から取得 → フォールバックで geoJsonMap → sanitize を適用する
 */
function resolveFeatureCollection(
  batchResult: Map<string, FeatureCollection>,
  id: MapId,
): FeatureCollection {
  const cached = batchResult.get(id);
  if (cached) return sanitizeFeatureCollection(cached);
  const asset = geoJsonMap[id];
  if (!asset) throw new Error(`[mapLayerCache] Not found: ${id}`);
  return sanitizeFeatureCollection(asset.content as FeatureCollection);
}

// ---- 公開関数 ----

/**
 * 全マップデータを一括ロードする。
 * 初回のみ SQLite I/O が発生し、以降はキャッシュを参照。
 */
export async function loadAllMapData(): Promise<void> {
  if (cacheStatus === "ready") return;
  if (cacheStatus === "loading" && loadPromise) return loadPromise;

  cacheStatus = "loading";
  loadPromise = (async () => {
    try {
      const repo = GeojsonRepository.getInstance();
      const batchResult = await repo.getMany(
        ALL_MAP_IDS as unknown as string[],
      );

      // venue / stairs
      const venue = resolveFeatureCollection(
        batchResult,
        "venue_venue" as MapId,
      );
      const stairs = resolveFeatureCollection(
        batchResult,
        "studyhall_stairs" as MapId,
      );

      // floors
      const floors = new Map<number, FloorCache>();
      const floorNumbers = [1, 2, 3, 4, 5];

      for (const floor of floorNumbers) {
        const surface = resolveFeatureCollection(
          batchResult,
          floorSurfaceId(floor),
        );
        const rooms = resolveFeatureCollection(
          batchResult,
          floorRoomsId(floor),
        );
        floors.set(floor, { surface, rooms, underlaySurface: null });
      }

      // 4F/5F の underlaySurface を 3F surface で設定
      const floor3 = floors.get(3);
      if (floor3) {
        for (const f of [4, 5]) {
          const existing = floors.get(f);
          if (existing) {
            floors.set(f, { ...existing, underlaySurface: floor3.surface });
          }
        }
      }

      cache = { venue, stairs, floors };
      cacheStatus = "ready";
    } catch (e) {
      cacheStatus = "error";
      console.warn("[mapLayerCache] loadAllMapData failed:", e);
      throw e;
    }
  })();

  return loadPromise;
}

/** キャッシュ全体を取得する。未ロード時は null。 */
export function getMapCache(): MapLayerCache | null {
  return cache;
}

/** キャッシュが利用可能かを返す。 */
export function isCacheReady(): boolean {
  return cacheStatus === "ready";
}

/** キャッシュを無効化する（再読込トリガー用）。 */
export function invalidateCache(): void {
  cache = null;
  cacheStatus = "idle";
  loadPromise = null;
}
