// types の型定義をまとめる。
import {
  Expression,
  FillLayerStyle,
  LineLayerStyle,
} from "@maplibre/maplibre-react-native";
import { GeoLayerProps } from "../../../types";

export type LayerConfig = {
  filter?: Expression;
  fillStyle: FillLayerStyle;
  lineStyle: LineLayerStyle;
};

export type PolygonProps = {
  prefixId: string;
  showLabel?: boolean;
  /** FillLayer と LineLayer の両方に設定する belowLayerID（MapLibre レイヤ ID） */
  belowLayerID?: string;
} & GeoLayerProps &
  LayerConfig;
