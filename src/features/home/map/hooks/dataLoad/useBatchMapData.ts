import type { FeatureCollection } from "geojson";
import { useEffect, useRef, useState } from "react";
import {
  loadAllMapData,
  getMapCache,
  isCacheReady,
  invalidateCache,
} from "./mapLayerCache";

// ---- 公開型 ----

export type FloorGeoData = {
  readonly units: FeatureCollection | null;
  readonly surface: FeatureCollection | null;
  readonly underlaySurface: FeatureCollection | null;
};

export type BatchState =
  | { readonly status: "loading"; readonly isInitial: true }
  | { readonly status: "loading"; readonly isInitial: false }
  | { readonly status: "ready" }
  | {
      readonly status: "error";
      readonly error: Error;
      readonly isInitial: boolean;
    };

export type BatchMapData = {
  readonly venue: FeatureCollection | null;
  readonly stairs: FeatureCollection | null;
  readonly floorData: FloorGeoData | null;
  readonly currentFloor: number;
  readonly state: BatchState;
  readonly isInitialLoading: boolean;
  readonly isFloorSwitching: boolean;
  readonly floorError: Error | null;
  readonly isCacheReady: boolean;
};

// ---- キャッシュ → FloorGeoData 変換 ----

function toFloorGeoData(floor: number): FloorGeoData | null {
  const cache = getMapCache();
  if (!cache) return null;
  const fc = cache.floors.get(floor);
  if (!fc) return null;
  return {
    units: fc.rooms,
    surface: fc.surface,
    underlaySurface: fc.underlaySurface,
  };
}

export function useBatchMapData(
  floor: number,
  retryKey?: number,
): BatchMapData {
  const [state, setState] = useState<BatchState>({
    status: "loading",
    isInitial: true,
  });
  const [venue, setVenue] = useState<FeatureCollection | null>(null);
  const [stairs, setStairs] = useState<FeatureCollection | null>(null);
  const [floorData, setFloorData] = useState<FloorGeoData | null>(null);
  // stale-while-revalidate: 前フロアデータを保持
  const [previousFloorData, setPreviousFloorData] =
    useState<FloorGeoData | null>(null);

  // retryKey 変更時にキャッシュをリセット → 再読み込み
  const prevRetryKeyRef = useRef<number | undefined>(retryKey);
  useEffect(() => {
    if (
      retryKey !== undefined &&
      prevRetryKeyRef.current !== undefined &&
      prevRetryKeyRef.current !== retryKey
    ) {
      setPreviousFloorData(null);
      invalidateCache();
    }
    prevRetryKeyRef.current = retryKey;
  }, [retryKey]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      setFloorData((current) => {
        if (current !== null) {
          setPreviousFloorData(current);
        }
        return null;
      });

      const isInitial = !isCacheReady();
      setState({ status: "loading", isInitial } as BatchState);

      try {
        // 初回のみ全データ一括ロード
        await loadAllMapData();
        if (signal.aborted) return;

        const cache = getMapCache()!;

        setVenue(cache.venue);
        setStairs(cache.stairs);

        const fd = toFloorGeoData(floor);
        if (!signal.aborted) {
          setFloorData(fd);
          setState({ status: "ready" });
        }
      } catch (e) {
        if (signal.aborted) return;
        setState({ status: "error", error: e as Error, isInitial });
      }
    })();

    return () => controller.abort();
  }, [floor, retryKey]);

  // 派生フラグ
  const isInitialLoading =
    state.status === "loading" && state.isInitial === true;
  const isFloorSwitching = false;
  const floorError =
    state.status === "error" && !state.isInitial
      ? (state as Extract<BatchState, { status: "error" }>).error
      : null;

  // stale-while-revalidate
  const displayFloorData = floorData ?? previousFloorData;

  return {
    venue,
    stairs,
    floorData: displayFloorData,
    currentFloor: floor,
    state,
    isInitialLoading,
    isFloorSwitching,
    floorError,
    isCacheReady: isCacheReady(),
  };
}
