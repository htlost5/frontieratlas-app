// unit の公開エクスポートをまとめる。
import { GeoLayerProps } from "../../../types";
import { BaseView } from "./bases";
import { RoomView } from "./rooms";
import type { ColorTheme } from "../../../constants/colorPalette";

type Props = GeoLayerProps & {
  colorTheme: ColorTheme;
  floor: number;
};

export function UnitView({ data, colorTheme, visible = true, floor }: Props) {
  return (
    <>
      <BaseView
        data={data}
        colorTheme={colorTheme}
        visible={visible}
        floor={floor}
      />
      <RoomView
        data={data}
        colorTheme={colorTheme}
        visible={visible}
        floor={floor}
      />
    </>
  );
}
