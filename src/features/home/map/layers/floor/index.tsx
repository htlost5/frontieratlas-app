// フロアレイヤーの描画コンポーネントを定義する。
// surface は MapScreen 側で明示的に配置されるため、FloorView は rooms のみを描画。
import { FloorProps } from "./types";
import { UnitView } from "./unit";

export function FloorView({
  floorData,
  colorTheme,
  visible = true,
}: FloorProps) {
  if (!floorData) return null;

  return (
    <UnitView
      data={floorData.units}
      colorTheme={colorTheme}
      visible={visible}
    />
  );
}
