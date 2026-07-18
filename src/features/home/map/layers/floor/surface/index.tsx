// surface レイヤーの公開エクスポートをまとめる。
import { PolygonLayer } from "../../../components/mapComp/PolygonLayer";
import { GeoLayerProps } from "../../../types";
import type { RoomCategoryPalette } from "../../../constants/colorPalette";

type Props = GeoLayerProps & {
  palette: RoomCategoryPalette;
  /** ID 重複を避けるためのプレフィックス。デフォルト "surface" */
  prefixId?: string;
  /** FillLayer/LineLayer の belowLayerID を PolygonLayer に渡す */
  belowLayerID?: string;
};

export function SurfaceLayer({
  data,
  palette,
  visible = true,
  prefixId = "surface",
  belowLayerID,
}: Props) {
  if (!data) return null;
  return (
    <PolygonLayer
      prefixId={prefixId}
      data={data}
      visible={visible}
      belowLayerID={belowLayerID}
      fillStyle={{ fillColor: palette.fill, fillOpacity: palette.opacity }}
      lineStyle={{ lineColor: palette.line, lineWidth: 2.5 }}
    />
  );
}
