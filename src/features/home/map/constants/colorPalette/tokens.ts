import type { ColorGroup, ColorTheme } from "./types";

/** テーマファクトリに渡す内部トークン型（opacity はファクトリ内で付与） */
type ColorTokens = {
  background: string;
  buildings: { fill: string; line: string };
  venue: { fill: string; line: string };
  surface: { fill: string; line: string };
  walls: { fill: string; line: string };
  atrium: { fill: string; line: string };
  stairs: { lineColor: string };
  rooms: Record<ColorGroup, { fill: string; line: string; circleFill: string }>;
  label: { textColor: string; textHaloColor: string };
  controls: {
    floorBg: string;
    floorSelectedBg: string;
    floorText: string;
    floorSelectedText: string;
  };
};

/**
 * トークンから完全な ColorTheme を構築するファクトリ関数。
 * opacity 系の固定値はここで付与する。
 */
function buildColorTheme(
  id: "light" | "dark",
  tokens: ColorTokens,
): ColorTheme {
  return {
    id,
    background: tokens.background,
    buildings: { ...tokens.buildings, opacity: 0.8 },
    venue: { ...tokens.venue, opacity: 1.0 },
    surface: { ...tokens.surface, opacity: 1.0 },
    walls: tokens.walls,
    atrium: tokens.atrium,
    stairs: {
      lineColor: tokens.stairs.lineColor,
      lineWidth: 2.5,
      lineOpacity: 0.8,
    },
    rooms: Object.fromEntries(
      (
        Object.entries(tokens.rooms) as [
          ColorGroup,
          { fill: string; line: string; circleFill: string },
        ][]
      ).map(([group, colors]) => [group, { ...colors, opacity: 1.0 }]),
    ) as Record<
      ColorGroup,
      { fill: string; line: string; circleFill?: string; opacity: number }
    >,
    label: { ...tokens.label, textHaloWidth: 1.5 },
    controls: tokens.controls,
  };
}

const LIGHT_TOKENS: ColorTokens = {
  background: "#F0F1F3",
  buildings: { fill: "#E8E8EC", line: "#D4D4D8" },
  venue: { fill: "#E3EBF7", line: "#B0C4DE" },
  surface: { fill: "#FBF8F2", line: "#E5DDD0" },
  walls: { fill: "#B8B8BD", line: "rgba(0,0,0,0.18)" },
  atrium: { fill: "#E0E0E0", line: "#BDBDBD" },
  stairs: { lineColor: "#A09080" },
  rooms: {
    blue: { fill: "#BBDEFB", line: "#90CAF9", circleFill: "#42A5F5" },
    purple: { fill: "#E1BEE7", line: "#CE93D8", circleFill: "#AB47BC" },
    cyan: { fill: "#B2EBF2", line: "#80DEEA", circleFill: "#00BCD4" },
    salmon: { fill: "#FFCDD2", line: "#EF9A9A", circleFill: "#E53935" },
    indigo: { fill: "#C5CAE9", line: "#9FA8DA", circleFill: "#5C6BC0" },
    lime: { fill: "#F0F4C3", line: "#E6EE9C", circleFill: "#C0CA33" },
    amber: { fill: "#FFF9C4", line: "#FFF176", circleFill: "#FBC02D" },
    teal: { fill: "#B2DFDB", line: "#80CBC4", circleFill: "#00897B" },
    green: { fill: "#C8E6C9", line: "#A5D6A7", circleFill: "#43A047" },
    pink: { fill: "#F8BBD0", line: "#F48FB1", circleFill: "#EC407A" },
    brown: { fill: "#D7CCC8", line: "#BCAAA4", circleFill: "#8D6E63" },
    coral: { fill: "#FFCCBC", line: "#FFAB91", circleFill: "#FF7043" },
    orange: { fill: "#FFE0B2", line: "#FFCC80", circleFill: "#FF9800" },
    gray: { fill: "#a2a2a2", line: "#BDBDBD", circleFill: "#757575" },
    gold: { fill: "#D4C830", line: "#B8A820", circleFill: "#8E7600" },
    bronze: { fill: "#E6C830", line: "#C9A820", circleFill: "#9E8600" },
    olive: { fill: "#D5D9C5", line: "#BCC0A8", circleFill: "#9E9E9E" },
    terrace: { fill: "rgba(0,0,0,0)", line: "#8A9A7B", circleFill: "#8A9A7B" },
  },
  label: { textColor: "#1A1A2E", textHaloColor: "rgba(255,255,255,0.7)" },
  controls: {
    floorBg: "#FFFFFF",
    floorSelectedBg: "rgba(0, 122, 255, 0.55)",
    floorText: "#3A3A3C",
    floorSelectedText: "#FFFFFF",
  },
};

const DARK_TOKENS: ColorTokens = {
  background: "#1A1C1E",
  buildings: { fill: "#24262B", line: "#3A3C42" },
  venue: { fill: "#1E2430", line: "#2A3548" },
  surface: { fill: "#2C2824", line: "#4A443D" },
  walls: { fill: "#4A4C52", line: "rgba(255,255,255,0.10)" },
  atrium: { fill: "#2C2C2C", line: "#424242" },
  stairs: { lineColor: "#8B7D6B" },
  rooms: {
    blue: { fill: "#1A3A5C", line: "#2A5290", circleFill: "#2A5290" },
    purple: { fill: "#2D1B4E", line: "#4A2C7A", circleFill: "#4A2C7A" },
    cyan: { fill: "#004D40", line: "#00695C", circleFill: "#00897B" },
    salmon: { fill: "#4A1A1A", line: "#6B2A2A", circleFill: "#8B3A3A" },
    indigo: { fill: "#1A1A4A", line: "#2A2A6B", circleFill: "#3A3A8B" },
    lime: { fill: "#2A3A1A", line: "#3A4A2A", circleFill: "#4A5A3A" },
    amber: { fill: "#4A4200", line: "#7A6E00", circleFill: "#7A6E00" },
    teal: { fill: "#00363A", line: "#00695C", circleFill: "#00695C" },
    green: { fill: "#1B3A1B", line: "#2E5A2E", circleFill: "#2E5A2E" },
    pink: { fill: "#4A1530", line: "#7A2048", circleFill: "#7A2048" },
    brown: { fill: "#3E2723", line: "#5D4037", circleFill: "#5D4037" },
    coral: { fill: "#3E1A10", line: "#6D3020", circleFill: "#6D3020" },
    orange: { fill: "#4A2800", line: "#7A4400", circleFill: "#7A4400" },
    gray: { fill: "#2C2C2C", line: "#424242", circleFill: "#424242" },
    gold: { fill: "#352A18", line: "#5D4818", circleFill: "#5D4818" },
    bronze: { fill: "#3D3520", line: "#6D5C20", circleFill: "#6D5C20" },
    olive: { fill: "#2E3028", line: "#4A4C3A", circleFill: "#4A4C3A" },
    terrace: { fill: "rgba(0,0,0,0)", line: "#6B7A5E", circleFill: "#6B7A5E" },
  },
  label: { textColor: "#E8E8EC", textHaloColor: "rgba(0,0,0,0.6)" },
  controls: {
    floorBg: "#2C2C2E",
    floorSelectedBg: "rgba(10, 132, 255, 0.55)",
    floorText: "#C7C7CC",
    floorSelectedText: "#FFFFFF",
  },
};

export const LIGHT_THEME: ColorTheme = buildColorTheme("light", LIGHT_TOKENS);

export const DARK_THEME: ColorTheme = buildColorTheme("dark", DARK_TOKENS);
