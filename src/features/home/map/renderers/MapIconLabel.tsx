// MapIconLabel component - derived from source/labels/label.tsx + source/labels/labelUI/labelView.tsx
// Uses display_point, zoomLabel, unitSymbol for rendering.
// File saved as UTF-8 without BOM.
import React from "react";
import type { FeatureCollection } from "geojson";
import { ShapeSource } from "@maplibre/maplibre-react-native";
import { LabelLayer } from "./labels/shareComp";
import { createLabelConfigs, LabelKey } from "./labels/LabelConfigs";
import type { ColorTheme } from "../constants/colorPalette";

type Props = {
  floor_num: number;
  /** 上位で加工済みの GeoJSON（display_point → geometry） */
  processedGeoJson: FeatureCollection | null;
  isVisible: boolean;
  colorTheme: ColorTheme;
  iconsVisible: boolean;
};

/**
 * MapIconLabel component that renders labels on the map.
 * - Receives already-processed GeoJSON (display_point extracted to geometry)
 *   from the parent, avoiding redundant processing per render.
 * - Renders labels via LabelLayer
 * - UnitSymbol (special symbols) is now rendered separately in MapScreen
 */
export function MapIconLabel({
  floor_num,
  processedGeoJson,
  isVisible,
  colorTheme,
  iconsVisible,
}: Props) {
  const labelConfigs = createLabelConfigs(colorTheme);

  // REV-CRITICAL-2 fix: isVisible が false の場合は非表示
  if (!processedGeoJson || !isVisible) return null;

  const labelSourceId = `${floor_num}F_label_view`;

  return (
    <>
      {/* DD-04: MapIconRegistry is moved to MapContainer level */}

      {/* GeoJSONデータをMapLibreのデータソースとして登録 */}
      <ShapeSource id={labelSourceId} shape={processedGeoJson}>
        {/* 全てのラベルタイプに対してレイヤーを生成 */}
        {(Object.keys(labelConfigs) as LabelKey[]).map((key) => (
          <LabelLayer
            key={key}
            floor_num={floor_num}
            sourceId={labelSourceId}
            config={labelConfigs[key]}
            floorLayerPrefix={`${floor_num}F_normal`}
            iconsVisible={iconsVisible}
          />
        ))}
      </ShapeSource>
    </>
  );
}
