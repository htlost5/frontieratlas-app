// configs: category.json キー → RoomCategory のマッピングとフィルタ生成
import type { Expression } from "@maplibre/maplibre-react-native";
import type { RoomCategory } from "../../../../constants/colorPalette";
import { ROOM_CATEGORIES, type RoomKey } from "./filter";
import { isFeatureVisible } from "../../../../config/categoryDisplayConfig";

export type RoomCategoryGroup = RoomCategory;

/** category.json キー → RoomCategory マッピング（33キー） */
export const ROOM_CATEGORY_MAP: Record<string, RoomCategoryGroup> = {
  // blue
  classroom: "learning",
  study_room: "learning",
  library: "library",
  // purple
  laboratory: "laboratory",
  prep_room: "prep",
  // sanitary（cyan）
  male_restroom: "restroom",
  female_restroom: "restroom",
  accessible_restroom: "restroom",
  changing_room: "changing",
  // circulation（設備）
  elevator: "elevator",
  vending: "vending",
  // gray（壁・構造）
  structure: "structure",
  fire_door: "waste",
  storage: "structure",
  atrium: "waste",
  locker_area: "structure",
  emergency_exit: "structure",
  // amber
  staff_room: "staff",
  meeting_room: "meeting",
  studio_room: "studio",
  broadcasting_room: "broadcasting",
  // teal
  it_room: "it",
  printing_room: "printing",
  // green
  listening_room: "listening",
  music_room: "music",
  // pink
  nursery_room: "nursery",
  // brown
  japanese_style_room: "japanese",
  art_room: "art",
  calligraphy_room: "art",
  // coral
  cooking_room: "cooking",
  sewing_room: "sewing",
  // orange
  workshop: "workshop",
  // gray
  waste_room: "waste",
  // olive
  courtyard: "courtyard",
};

/** 全25 RoomCategory */
export const CATEGORIES: RoomCategory[] = [
  "learning",
  "structure",
  "laboratory",
  "prep",
  "staff",
  "meeting",
  "library",
  "it",
  "listening",
  "nursery",
  "studio",
  "broadcasting",
  "printing",
  "music",
  "japanese",
  "cooking",
  "sewing",
  "art",
  "workshop",
  "restroom",
  "vending",
  "changing",
  "elevator",
  "waste",
  "courtyard",
];

/** category.json キー → DisplayMode 導出 */
export type DisplayMode =
  | "icon_and_text"
  | "symbol_only"
  | "text_only"
  | "hidden";

export function getDisplayMode(categoryJsonKey: string): DisplayMode {
  if (categoryJsonKey in ROOM_CATEGORY_MAP) {
    return ROOM_CATEGORY_MAP[categoryJsonKey] === "courtyard"
      ? "text_only"
      : "icon_and_text";
  }
  // POI_CATEGORY_MAP の参照は循環依存回避のため、文字列判定で代用
  // POIキーの検出は別途 poiConfigs.ts で行う
  return "hidden";
}

/** 指定カテゴリのフィルタ式（visible=false を自動除去） */
export function buildCategoryFilter(category: RoomCategory): Expression {
  const values = Object.entries(ROOM_CATEGORY_MAP)
    .filter(([, cat]) => cat === category)
    .map(([key]) => ROOM_CATEGORIES[key as RoomKey])
    .filter(isFeatureVisible);

  if (values.length === 0) {
    return [
      "in",
      ["get", "category"],
      ["literal", [""]],
    ] as unknown as Expression;
  }
  return [
    "in",
    ["get", "category"],
    ["literal", values],
  ] as unknown as Expression;
}
