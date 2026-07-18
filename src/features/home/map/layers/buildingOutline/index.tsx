// 建物アウトラインレイヤー
// 3F surface データを建物アウトラインとして表示する。
// BuildingsView の代替。building モード時のみ表示。

import React from "react";
import { PolygonLayer } from "../../components/mapComp/PolygonLayer";
import type { FeatureCollection } from "geojson";
import type { ColorTheme } from "../../constants/colorPalette";

type Props = {
  data: FeatureCollection | null;
  visible: boolean;
  colorTheme: ColorTheme;
};

export const BuildingOutlineLayer = React.memo(function BuildingOutlineLayer({
  data,
  visible,
  colorTheme,
}: Props) {
  if (!data) return null;

  return (
    <PolygonLayer
      prefixId="buildingOutline"
      data={data}
      visible={visible}
      fillStyle={{
        fillColor: colorTheme.buildings.fill,
        fillOpacity: colorTheme.buildings.opacity,
      }}
      lineStyle={{
        lineColor: colorTheme.buildings.line,
        lineWidth: 2.5,
      }}
    />
  );
});
