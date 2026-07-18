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
  | "courtyard";

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
  | "olive";

/** RoomCategory → ColorGroup マッピング */
export const ROOM_COLOR_GROUP: Record<RoomCategory, ColorGroup> = {
  learning: "blue",
  library: "blue",
  laboratory: "purple",
  prep: "gray",
  structure: "gray",
  meeting: "gold",
  staff: "bronze",
  it: "teal",
  listening: "green",
  nursery: "pink",
  studio: "amber",
  broadcasting: "amber",
  printing: "teal",
  music: "green",
  japanese: "brown",
  cooking: "coral",
  sewing: "coral",
  art: "brown",
  workshop: "orange",
  restroom: "cyan",
  vending: "salmon",
  changing: "indigo",
  elevator: "lime",
  waste: "gray",
  courtyard: "olive",
};

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

export const LIGHT_THEME: ColorTheme = {
  id: "light",
  background: "#F0F1F3",
  buildings: { fill: "#E8E8EC", line: "#D4D4D8", opacity: 0.8 },
  venue: { fill: "#E3EBF7", line: "#B0C4DE", opacity: 1.0 },
  surface: { fill: "#FBF8F2", line: "#E5DDD0", opacity: 1.0 },
  walls: { fill: "#B8B8BD", line: "rgba(0,0,0,0.18)" },
  atrium: { fill: "#D5D9C5", line: "rgba(0,0,0,0.15)" },
  stairs: { lineColor: "#A09080", lineWidth: 2.5, lineOpacity: 0.8 },
  rooms: {
    blue: {
      fill: "#BBDEFB",
      line: "#90CAF9",
      circleFill: "#42A5F5",
      opacity: 1.0,
    },
    purple: {
      fill: "#E1BEE7",
      line: "#CE93D8",
      circleFill: "#AB47BC",
      opacity: 1.0,
    },
    cyan: {
      fill: "#B2EBF2",
      line: "#80DEEA",
      circleFill: "#00BCD4",
      opacity: 1.0,
    },
    salmon: {
      fill: "#FFCDD2",
      line: "#EF9A9A",
      circleFill: "#E53935",
      opacity: 1.0,
    },
    indigo: {
      fill: "#C5CAE9",
      line: "#9FA8DA",
      circleFill: "#5C6BC0",
      opacity: 1.0,
    },
    lime: {
      fill: "#F0F4C3",
      line: "#E6EE9C",
      circleFill: "#C0CA33",
      opacity: 1.0,
    },
    amber: {
      fill: "#FFF9C4",
      line: "#FFF176",
      circleFill: "#FBC02D",
      opacity: 1.0,
    },
    teal: {
      fill: "#B2DFDB",
      line: "#80CBC4",
      circleFill: "#00897B",
      opacity: 1.0,
    },
    green: {
      fill: "#C8E6C9",
      line: "#A5D6A7",
      circleFill: "#43A047",
      opacity: 1.0,
    },
    pink: {
      fill: "#F8BBD0",
      line: "#F48FB1",
      circleFill: "#EC407A",
      opacity: 1.0,
    },
    brown: {
      fill: "#D7CCC8",
      line: "#BCAAA4",
      circleFill: "#8D6E63",
      opacity: 1.0,
    },
    coral: {
      fill: "#FFCCBC",
      line: "#FFAB91",
      circleFill: "#FF7043",
      opacity: 1.0,
    },
    orange: {
      fill: "#FFE0B2",
      line: "#FFCC80",
      circleFill: "#FF9800",
      opacity: 1.0,
    },
    gray: {
      fill: "#E0E0E0",
      line: "#BDBDBD",
      circleFill: "#757575",
      opacity: 1.0,
    },
    gold: {
      fill: "#D4C830",
      line: "#B8A820",
      circleFill: "#8E7600",
      opacity: 1.0,
    },
    bronze: {
      fill: "#E6C830",
      line: "#C9A820",
      circleFill: "#9E8600",
      opacity: 1.0,
    },
    olive: {
      fill: "#D5D9C5",
      line: "#BCC0A8",
      circleFill: "#9E9E9E",
      opacity: 1.0,
    },
  },
  label: {
    textColor: "#1A1A2E",
    textHaloColor: "rgba(255,255,255,0.7)",
    textHaloWidth: 1.5,
  },
  controls: {
    floorBg: "#FFFFFF",
    floorSelectedBg: "rgba(0, 122, 255, 0.55)",
    floorText: "#3A3A3C",
    floorSelectedText: "#FFFFFF",
  },
};

export const DARK_THEME: ColorTheme = {
  id: "dark",
  background: "#1A1C1E",
  buildings: { fill: "#24262B", line: "#3A3C42", opacity: 0.8 },
  venue: { fill: "#1E2430", line: "#2A3548", opacity: 1.0 },
  surface: { fill: "#2C2824", line: "#4A443D", opacity: 1.0 },
  walls: { fill: "#4A4C52", line: "rgba(255,255,255,0.10)" },
  atrium: { fill: "#2E3028", line: "rgba(255,255,255,0.08)" },
  stairs: { lineColor: "#8B7D6B", lineWidth: 2.5, lineOpacity: 0.8 },
  rooms: {
    blue: {
      fill: "#1A3A5C",
      line: "#2A5290",
      circleFill: "#2A5290",
      opacity: 1.0,
    },
    purple: {
      fill: "#2D1B4E",
      line: "#4A2C7A",
      circleFill: "#4A2C7A",
      opacity: 1.0,
    },
    cyan: {
      fill: "#004D40",
      line: "#00695C",
      circleFill: "#00897B",
      opacity: 1.0,
    },
    salmon: {
      fill: "#4A1A1A",
      line: "#6B2A2A",
      circleFill: "#8B3A3A",
      opacity: 1.0,
    },
    indigo: {
      fill: "#1A1A4A",
      line: "#2A2A6B",
      circleFill: "#3A3A8B",
      opacity: 1.0,
    },
    lime: {
      fill: "#2A3A1A",
      line: "#3A4A2A",
      circleFill: "#4A5A3A",
      opacity: 1.0,
    },
    amber: {
      fill: "#4A4200",
      line: "#7A6E00",
      circleFill: "#7A6E00",
      opacity: 1.0,
    },
    teal: {
      fill: "#00363A",
      line: "#00695C",
      circleFill: "#00695C",
      opacity: 1.0,
    },
    green: {
      fill: "#1B3A1B",
      line: "#2E5A2E",
      circleFill: "#2E5A2E",
      opacity: 1.0,
    },
    pink: {
      fill: "#4A1530",
      line: "#7A2048",
      circleFill: "#7A2048",
      opacity: 1.0,
    },
    brown: {
      fill: "#3E2723",
      line: "#5D4037",
      circleFill: "#5D4037",
      opacity: 1.0,
    },
    coral: {
      fill: "#3E1A10",
      line: "#6D3020",
      circleFill: "#6D3020",
      opacity: 1.0,
    },
    orange: {
      fill: "#4A2800",
      line: "#7A4400",
      circleFill: "#7A4400",
      opacity: 1.0,
    },
    gray: {
      fill: "#2C2C2C",
      line: "#424242",
      circleFill: "#424242",
      opacity: 1.0,
    },
    gold: {
      fill: "#352A18",
      line: "#5D4818",
      circleFill: "#5D4818",
      opacity: 1.0,
    },
    bronze: {
      fill: "#3D3520",
      line: "#6D5C20",
      circleFill: "#6D5C20",
      opacity: 1.0,
    },
    olive: {
      fill: "#2E3028",
      line: "#4A4C3A",
      circleFill: "#4A4C3A",
      opacity: 1.0,
    },
  },
  label: {
    textColor: "#E8E8EC",
    textHaloColor: "rgba(0,0,0,0.6)",
    textHaloWidth: 1.5,
  },
  controls: {
    floorBg: "#2C2C2E",
    floorSelectedBg: "rgba(10, 132, 255, 0.55)",
    floorText: "#C7C7CC",
    floorSelectedText: "#FFFFFF",
  },
};
