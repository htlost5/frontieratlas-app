// MapRoot.tsx
import { CameraRef } from "@maplibre/maplibre-react-native";
import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  startTransition,
} from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { MapScreen } from "./MapScreen";
import { MapContext } from "./context/MapContext";
import { mapConfig } from "./constants/mapConfig";
import { LIGHT_THEME, DARK_THEME } from "./constants/colorPalette";
import { useSearch } from "@/src/features/home/search/Context/SearchContext";

type Props = {
  children: React.ReactNode;
};

const MapRootBase = ({ children }: Props) => {
  const cameraRef = useRef<CameraRef>(null);
  const [floor, setFloor] = useState(mapConfig.default.floor);
  const [zoom, setZoom] = useState(mapConfig.default.zoom);
  const [iconsVisible, setIconsVisible] = useState(false);
  const [venueVisible, setVenueVisible] = useState(false);
  const scheme = useColorScheme();

  const colorTheme = scheme === "dark" ? DARK_THEME : LIGHT_THEME;

  // startTransition でラップした setFloor — フロア切替を非同期更新にし UI 応答性を維持
  const wrappedSetFloor = useCallback((n: number) => {
    startTransition(() => {
      setFloor(n);
    });
  }, []);

  const moveTo = useCallback(
    (
      center: [number, number],
      nextZoom?: number,
      padding?: { top: number; bottom: number; left: number; right: number },
    ) => {
      cameraRef.current?.setCamera({
        centerCoordinate: center,
        ...(nextZoom !== undefined ? { zoomLevel: nextZoom } : {}),
        animationDuration: 600,
        ...(padding
          ? {
              padding: {
                paddingTop: padding.top,
                paddingBottom: padding.bottom,
                paddingLeft: padding.left,
                paddingRight: padding.right,
              },
            }
          : {}),
      });
    },
    [],
  );

  const flyToSearchResult = useCallback(
    (center: [number, number], zoom = 19.5) => {
      cameraRef.current?.setCamera({
        centerCoordinate: center,
        zoomLevel: zoom,
        animationDuration: 600,
        padding: {
          paddingTop: 100,
          paddingBottom: 220,
          paddingLeft: 60,
          paddingRight: 20,
        },
      });
    },
    [],
  );

  // 検索結果選択の監視: 選択時に floor 移動 + flyTo を実行（初回のみ）
  const { selectedSearchResult, setSelectedSearchResult } = useSearch();
  const lastHandledSearchIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!selectedSearchResult) return;
    if (lastHandledSearchIdRef.current === selectedSearchResult.id) return;
    lastHandledSearchIdRef.current = selectedSearchResult.id;
    const { floor: targetFloor, coordinates } = selectedSearchResult;
    if (targetFloor !== floor) {
      wrappedSetFloor(targetFloor);
    }
    flyToSearchResult(coordinates);
  }, [selectedSearchResult, floor, wrappedSetFloor, flyToSearchResult]);

  const handleClearHighlight = useCallback(() => {
    lastHandledSearchIdRef.current = null;
    setSelectedSearchResult(null);
  }, [setSelectedSearchResult]);

  return (
    <MapContext.Provider
      value={{
        cameraRef,
        floor,
        setFloor: wrappedSetFloor,
        zoom,
        setZoom,
        moveTo,
        colorTheme,
        flyToSearchResult,
        iconsVisible,
        setIconsVisible,
        venueVisible,
        setVenueVisible,
      }}
    >
      <View style={styles.root}>
        {/* Map は完全に背景 */}
        <View style={StyleSheet.absoluteFill}>
          <MapScreen
            cameraRef={cameraRef}
            highlightedSearchResult={selectedSearchResult}
            onClearHighlight={handleClearHighlight}
          />
        </View>

        {/* タブ・UI を上に重ねる */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {children}
        </View>
      </View>
    </MapContext.Provider>
  );
};

MapRootBase.displayName = "MapRoot";
export const MapRoot = memo(MapRootBase);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
