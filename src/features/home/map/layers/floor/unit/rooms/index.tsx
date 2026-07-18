// rooms の公開エクスポートをまとめる。
// 8つの RoomCategory 別に動的に PolygonLayer を生成する。
import { PolygonLayer } from "../../../../components/mapComp/PolygonLayer";
import { GeoLayerProps } from "../../../../types";
import { CATEGORIES, buildCategoryFilter } from "./configs";
import type {
  ColorTheme,
  ColorGroup,
} from "../../../../constants/colorPalette";
import { ROOM_COLOR_GROUP } from "../../../../constants/colorPalette";

type Props = GeoLayerProps & {
  colorTheme: ColorTheme;
  floor: number;
};

export function RoomView({ data, colorTheme, visible = true, floor }: Props) {
  if (!data) return null;

  return (
    <>
      {CATEGORIES.map((category) => {
        const colorGroup = ROOM_COLOR_GROUP[category];
        const palette = colorTheme.rooms[colorGroup];
        const filter = buildCategoryFilter(category);
        return (
          <PolygonLayer
            key={category}
            prefixId={`${floor}F_rooms_cat_${category}`}
            data={data}
            visible={visible}
            filter={filter}
            fillStyle={{
              fillColor: palette.fill,
              fillOpacity: palette.opacity,
            }}
            lineStyle={{ lineColor: palette.line }}
          />
        );
      })}
    </>
  );
}
