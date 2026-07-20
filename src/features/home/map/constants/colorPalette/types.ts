// 機能別ゾーン配色 + 基盤レイヤー配色 + UI配色を定義する。
export type RoomCategory =
  | "learning"
  | "laboratory"
  | "prep"
  | "structure"
  | "meeting"
  | "library"
  | "it"
  | "listening"
  | "nursery"
  | "outdoor_space"
  | "studio"
  | "broadcasting"
  | "printing"
  | "music"
  | "japanese"
  | "cooking"
  | "sewing"
  | "art"
  | "workshop"
  | "restroom"
  | "vending"
  | "changing"
  | "elevator"
  | "waste"
  | "staff"
  | "courtyard"
  | "terrace";

/** 11の色共有グループ */
export type ColorGroup =
  | "blue"
  | "purple"
  | "cyan"
  | "salmon"
  | "indigo"
  | "lime"
  | "amber"
  | "teal"
  | "green"
  | "pink"
  | "brown"
  | "coral"
  | "orange"
  | "gray"
  | "gold"
  | "bronze"
  | "olive"
  | "terrace";

export type RoomCategoryPalette = {
  fill: string;
  line: string;
  circleFill?: string;
  opacity: number;
};

export type StairsPalette = {
  lineColor: string;
  lineWidth: number;
  lineOpacity: number;
};

export type ColorTheme = {
  id: "light" | "dark";
  background: string;
  buildings: RoomCategoryPalette;
  venue: RoomCategoryPalette;
  surface: RoomCategoryPalette;
  stairs: StairsPalette;
  walls: { fill: string; line: string };
  atrium: { fill: string; line: string };
  rooms: Record<ColorGroup, RoomCategoryPalette>;
  label: {
    textColor: string;
    textHaloColor: string;
    textHaloWidth: number;
  };
  controls: {
    floorBg: string;
    floorSelectedBg: string;
    floorText: string;
    floorSelectedText: string;
  };
};
