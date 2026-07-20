// カテゴリ別ラベル表示設定
import { LabelConfig } from "@/src/features/home/map/renderers/labels/LabelConfig";
import {
  LIGHT_THEME,
  type RoomCategory,
  type ColorTheme,
} from "@/src/features/home/map/constants/colorPalette";
import {
  buildLabelFilter,
  ROOM_CATEGORY_MAP,
  CATEGORIES,
} from "@/src/features/home/map/layers/floor/unit/rooms/configs";
import {
  ROOM_CATEGORIES,
  type RoomKey,
} from "@/src/features/home/map/layers/floor/unit/rooms/filter";
import {
  getCategoryConfig,
  isLabelIconVisible,
  isLabelTextVisible,
} from "@/src/features/home/map/config/categoryDisplayConfig";

export type LabelKey = RoomCategory;

function buildLabelOverrides(): Partial<
  Record<LabelKey, Partial<LabelConfig>>
> {
  const overrides: Partial<Record<LabelKey, Partial<LabelConfig>>> = {};

  for (const cat of CATEGORIES) {
    const geoValues = Object.entries(ROOM_CATEGORY_MAP)
      .filter(([, c]) => c === cat)
      .map(([key]) => ROOM_CATEGORIES[key as RoomKey]);

    const configuredValues = geoValues.filter(
      (v) => getCategoryConfig(v) !== undefined,
    );

    if (configuredValues.length === 0) continue;

    const anyIcon = configuredValues.some((v) => isLabelIconVisible(v));
    const anyText = configuredValues.some((v) => isLabelTextVisible(v));

    overrides[cat] = { iconVisible: anyIcon, textVisible: anyText };
  }

  return overrides;
}

export function createLabelConfigs(
  colorTheme: ColorTheme,
): Record<LabelKey, LabelConfig> {
  const themeSuffix = colorTheme.id;
  const overrides = buildLabelOverrides();

  return Object.fromEntries(
    CATEGORIES.map((cat) => [
      cat,
      {
        key: cat,
        iconKey: `${cat}-${themeSuffix}`,
        filter: buildLabelFilter(cat),
        textColor: colorTheme.label.textColor,
        textHaloColor: colorTheme.label.textHaloColor,
        textHaloWidth: colorTheme.label.textHaloWidth,
        iconVisible: cat !== "courtyard",
        textVisible: true,
        ...overrides[cat],
      },
    ]),
  ) as Record<LabelKey, LabelConfig>;
}

export const LABEL_CONFIGS: Record<LabelKey, LabelConfig> =
  createLabelConfigs(LIGHT_THEME);
