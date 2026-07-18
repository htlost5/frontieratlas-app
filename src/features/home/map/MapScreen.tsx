// マップ画面の描画とデータ読み込みを統合するコンポーネント。
import React, { useCallback, useMemo, useRef, useState } from "react";

import type { CameraRef } from "@maplibre/maplibre-react-native";

import { MapContainer } from "./components/MapContainer";
import { ErrorOverlay } from "./components/ErrorOverlay";
import { FullScreenLoading } from "./components/FullScreenLoading";

import { useDisplayLevel } from "./hooks/state/useDisplayLevel";
import { useMapContext } from "./hooks/state/useMapContext";

import { useBatchMapData } from "./hooks/dataLoad/useBatchMapData";

import type { CameraRegion } from "./types";
import { BuildingOutlineLayer } from "./layers/buildingOutline";
import { FloorView } from "./layers/floor";
import { SurfaceLayer } from "./layers/floor/surface";
import { VenueView } from "./layers/venue";
import { MapIconLabel } from "./renderers/MapIconLabel";
import { UnitSymbol } from "./renderers/UnitSymbol";
import { StairsLayer } from "./layers/stairs";
import { processUnitData } from "./renderers/processUnitData";
import { getMapCache } from "./hooks/dataLoad/mapLayerCache";

type Props = {
  cameraRef: React.RefObject<CameraRef | null>;
  retryKey?: number; // 外部からインクリメントして再マウントさせる
};

export function MapScreen({ cameraRef, retryKey = 0 }: Props) {
  const { floor, zoom, setZoom, colorTheme } = useMapContext();
  const displayMode = useDisplayLevel(zoom);
  const showBuildings = displayMode === "building";

  // 再試行用の内部カウンタ（useBatchMapData に渡して再フェッチをトリガー）
  const [retryCount, setRetryCount] = React.useState(0);
  // 派生状態 — floor / retryCount の組み合わせキーで dismiss を管理
  const [dismissedAtKey, setDismissedAtKey] = useState(0);
  const currentKey = floor * 1_000_000 + retryCount;
  const errorDismissed = dismissedAtKey === currentKey;

  const batchData = useBatchMapData(floor, retryCount);

  // BuildingOutline: キャッシュの 3F surface データ（building モード時、現在の floor に関わらず固定表示）
  const buildingOutlineData = useMemo(() => {
    const cache = getMapCache();
    return cache?.floors.get(3)?.surface ?? null;
  }, [batchData.isCacheReady]);

  const handleRetry = useCallback(() => {
    setRetryCount((c) => c + 1);
  }, []);
  const handleDismiss = useCallback(() => {
    setDismissedAtKey(currentKey);
  }, [currentKey]);

  // processedGeoJson: UnitSymbol 用の表示ポイントデータ（MapIconLabel と共有）
  const processedUnitGeoJson = useMemo(() => {
    const result = processUnitData(batchData.floorData?.units ?? null);
    console.log(
      "[UnitSymbol] processedUnitGeoJson features:",
      result?.features?.length ?? 0,
    );
    return result;
  }, [batchData.floorData?.units]);

  // W19: 前回のズーム値を追跡
  const prevZoomRef = useRef<number | null>(null);
  const handleRegionIsChanging = useCallback(
    (region: CameraRegion) => {
      const z = region?.properties?.zoomLevel;
      const vb = region?.properties?.visibleBounds;
      if (typeof z === "number" && prevZoomRef.current !== z) {
        prevZoomRef.current = z;
        const ne = vb?.[0];
        const sw = vb?.[1];
        console.log("[zoom]", z, "bounds:", { ne, sw });
        setZoom(z);
      }
    },
    [setZoom],
  );

  // --- 3-State Rendering ---

  // State 1: 初回ロード中（MapContainer 非マウント）
  if (batchData.isInitialLoading) {
    return <FullScreenLoading />;
  }

  // State 2: 初回エラー（MapContainer 非マウント）
  if (
    batchData.state.status === "error" &&
    batchData.state.isInitial === true
  ) {
    const state = batchData.state as Extract<
      typeof batchData.state,
      { status: "error" }
    >;
    const errMsg = state.error.message;
    return (
      <ErrorOverlay
        variant="fullscreen"
        visible={true}
        message={errMsg}
        onRetry={handleRetry}
      />
    );
  }

  // State 3: データ完備 or フロア切替中 or フロア切替エラー
  // → MapContainer 常時マウント
  const isInteriorVisible = displayMode !== "building";

  return (
    <MapContainer
      cameraRef={cameraRef}
      onRegionIsChanging={handleRegionIsChanging}
    >
      {/* フロア切替エラーオーバーレイ */}
      {batchData.floorError && !errorDismissed && (
        <ErrorOverlay
          variant="overlay"
          visible={true}
          message={batchData.floorError.message}
          onRetry={handleRetry}
          onDismiss={handleDismiss}
        />
      )}

      {/* ================================================================
          レイヤ順序（bottom → top）:
          1. Venue (常時)
          2. Surface: underlay (4F/5F only, visible 時のみ)
          3. Surface: current floor
          4. Stairs
          5. FloorView (rooms: BaseView + RoomView)
          6. UnitSymbol (special symbols)
          7. MapIconLabel (labels)
          8. BuildingOutlineLayer (building mode のみ)
          ================================================================ */}

      {/* 1. Venue — 最背面・常時マウント */}
      {batchData.venue && (
        <VenueView data={batchData.venue} colorTheme={colorTheme} />
      )}

      {/* 2. Surface underlay (4F/5F の 3F surface, opacity 0.5) */}
      {batchData.floorData?.underlaySurface && (
        <SurfaceLayer
          prefixId="surface_underlay"
          data={batchData.floorData.underlaySurface}
          palette={{ ...colorTheme.surface, opacity: 0.5 }}
          visible={isInteriorVisible}
          belowLayerID="fillLayer_surface_current"
        />
      )}

      {/* 3. Surface — current floor */}
      {batchData.floorData?.surface && (
        <SurfaceLayer
          prefixId="surface_current"
          data={batchData.floorData.surface}
          palette={colorTheme.surface}
          visible={isInteriorVisible}
        />
      )}

      {/* 4. Stairs — FloorView (rooms) の下・常時マウント */}
      {batchData.stairs && (
        <StairsLayer
          data={batchData.stairs}
          currentFloor={batchData.currentFloor}
          palette={colorTheme.stairs}
          visible={isInteriorVisible}
        />
      )}

      {/* 5. FloorView (rooms) — surface/stairs の上、symbol の下 */}
      {batchData.floorData && (
        <FloorView
          floorData={batchData.floorData}
          colorTheme={colorTheme}
          visible={isInteriorVisible}
          floor={batchData.currentFloor}
        />
      )}

      {/* 6. 特殊シンボル（トイレ・EV・階段など） */}
      {batchData.floorData?.units && processedUnitGeoJson && (
        <UnitSymbol
          pointData={processedUnitGeoJson}
          isVisible={isInteriorVisible ? 1 : 0}
          floor={batchData.currentFloor}
        />
      )}

      {/* 7. ラベル — 最前面に近い */}
      {batchData.floorData?.units && (
        <MapIconLabel
          floor_num={batchData.currentFloor}
          data={batchData.floorData.units}
          isVisible={isInteriorVisible}
          colorTheme={colorTheme}
        />
      )}

      {/* 8. BuildingOutline — building モード時のみ表示（3F surface を固定使用） */}
      {buildingOutlineData && (
        <BuildingOutlineLayer
          data={buildingOutlineData}
          visible={showBuildings}
          colorTheme={colorTheme}
        />
      )}
    </MapContainer>
  );
}
