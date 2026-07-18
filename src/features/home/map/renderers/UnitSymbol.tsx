// 特殊シンボル統合コンポーネント（角丸四角背景＋白アイコン）
import { ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { iconSizeExpression } from "./expressions/expressionHelpers";
import {
  buildPoiIconImageExpression,
  buildPoiSortKeyExpression,
  buildPoiFilter,
} from "../layers/floor/unit/rooms/poiConfigs";

type Props = {
  pointData: FeatureCollection | null;
  isVisible: number;
};

const iconImageExpression = buildPoiIconImageExpression();
const sortKeyExpression = buildPoiSortKeyExpression();
const poiFilter = buildPoiFilter();

export function UnitSymbol({ pointData, isVisible }: Props) {
  if (!pointData) return null;

  return (
    <ShapeSource id="unit-symbol-source" shape={pointData}>
      <SymbolLayer
        id="unit-symbol-layer"
        filter={poiFilter}
        style={{
          iconImage: iconImageExpression,
          iconSize: iconSizeExpression([
            [17, 0.18],
            [20, 0.38],
          ]),
          iconAllowOverlap: false,
          iconIgnorePlacement: false,
          symbolSortKey: sortKeyExpression,
          iconOpacity: [
            "interpolate",
            ["linear"],
            ["zoom"],
            16,
            isVisible,
            17,
            isVisible,
          ],
        }}
      />
    </ShapeSource>
  );
}
