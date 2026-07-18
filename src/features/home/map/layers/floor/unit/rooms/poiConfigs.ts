// POI 特殊シンボルの設定（Type 2: 角丸四角アイコンのみ）
import type { Expression } from "@maplibre/maplibre-react-native";
import { ROOM_CATEGORIES, type RoomKey } from "./filter";
import { isFeatureVisible } from "../../../../config/categoryDisplayConfig";

export type PoiCategory =
  | "emergency_exit"
  | "male_restroom"
  | "female_restroom"
  | "accessible_restroom"
  | "vending"
  | "stairs"
  | "elevator"
  | "locker_area"
  | "storage"
  | "fire_door"
  | "changing_room";

export interface PoiIconSpec {
  category: PoiCategory;
  iconKey: string;
  sortKey: number;
}

/** category.json キー → PoiIconSpec マッピング（11種） */
export const POI_CATEGORY_MAP: Record<string, PoiIconSpec> = {
  male_restroom: {
    category: "male_restroom",
    iconKey: "special-toilet-male",
    sortKey: 1,
  },
  female_restroom: {
    category: "female_restroom",
    iconKey: "special-toilet-female",
    sortKey: 1,
  },
  accessible_restroom: {
    category: "accessible_restroom",
    iconKey: "special-toilet-accessible",
    sortKey: 1,
  },
  elevator: { category: "elevator", iconKey: "special-elevator", sortKey: 2 },
  stairs: { category: "stairs", iconKey: "special-stairs", sortKey: 2 },
  emergency_exit: {
    category: "emergency_exit",
    iconKey: "special-emergency-exit",
    sortKey: 2,
  },
  vending: { category: "vending", iconKey: "special-vending", sortKey: 3 },
  locker_area: {
    category: "locker_area",
    iconKey: "special-storage",
    sortKey: 3,
  },
  storage: {
    category: "storage",
    iconKey: "special-storage",
    sortKey: 3,
  },
  fire_door: {
    category: "fire_door",
    iconKey: "special-fire-door",
    sortKey: 3,
  },
  changing_room: {
    category: "changing_room",
    iconKey: "special-changing-room",
    sortKey: 3,
  },
};

/** 全 POI キーの配列 */
export function getAllPoiKeys(): string[] {
  return Object.keys(POI_CATEGORY_MAP);
}

/** POI表示対象の GeoJSON カテゴリ値を取得 */
export function getPoiGeoJsonCategories(): string[] {
  return Object.entries(ROOM_CATEGORIES)
    .filter(([key]) => key in POI_CATEGORY_MAP)
    .filter(([key]) => isFeatureVisible(ROOM_CATEGORIES[key as RoomKey]))
    .map(([, value]) => value);
}

/** POI の iconImage match expression を動的生成 */
export function buildPoiIconImageExpression(): Expression {
  const entries = Object.entries(POI_CATEGORY_MAP);
  const parts: unknown[] = [];
  for (const [key, spec] of entries) {
    parts.push(key, spec.iconKey);
  }
  parts.push(""); // fallback
  return ["match", ["get", "category"], ...parts] as unknown as Expression;
}

/** POI の symbolSortKey match expression を動的生成 */
export function buildPoiSortKeyExpression(): Expression {
  const entries = Object.entries(POI_CATEGORY_MAP);
  const parts: unknown[] = [];
  for (const [key, spec] of entries) {
    parts.push(key, spec.sortKey);
  }
  parts.push(999); // fallback
  return ["match", ["get", "category"], ...parts] as unknown as Expression;
}

/** POI 用フィルタ式 */
export function buildPoiFilter(): Expression {
  const poiCategories = getPoiGeoJsonCategories();
  if (poiCategories.length === 0) {
    return ["==", ["get", "category"], ""] as unknown as Expression;
  }
  return [
    "in",
    ["get", "category"],
    ["literal", poiCategories],
  ] as unknown as Expression;
}
