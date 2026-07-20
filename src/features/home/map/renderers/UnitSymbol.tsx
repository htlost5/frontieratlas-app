// 特殊シンボル統合コンポーネント（角丸四角背景＋白アイコン）
import { ShapeSource, SymbolLayer } from "@maplibre/maplibre-react-native";
import type { FeatureCollection } from "geojson";
import { sizeExpression } from "./expressions/expressionHelpers";
import {
  buildPoiIconImageExpression,
  buildPoiSortKeyExpression,
  buildPoiFilter,
} from "../layers/floor/unit/rooms/poiConfigs";

type Props = {
  pointData: FeatureCollection | null;
  isVisible: number;
  floor: number;
};

const iconImageExpression = buildPoiIconImageExpression();
const sortKeyExpression = buildPoiSortKeyExpression();
const poiFilter = buildPoiFilter();

export function UnitSymbol({ pointData, isVisible, floor }: Props) {
  if (!pointData) return null;

  return (
    <ShapeSource id={`${floor}F_unit_symbol_source`} shape={pointData}>
      <SymbolLayer
        id={`${floor}F_unit_symbol`}
        filter={poiFilter}
        style={{
          iconImage: iconImageExpression,
          iconSize: sizeExpression([
            [17.8, 0.07],
            [20.3, 0.26],
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
