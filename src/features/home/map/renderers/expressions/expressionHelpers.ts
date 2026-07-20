// MapLibre の式生成に関する補助ロジックを提供する。
import type { Expression } from "@maplibre/maplibre-react-native";

/**
 * 指数補間（exponential, base 1.5）によるアイコンサイズの Maplibre Expression を生成。
 * @param stops - [zoomLevel, iconSize] のタプル配列（2点以上必須）
 */
export function sizeExpression(stops: [number, number][]): Expression {
  if (stops.length < 2) {
    throw new Error("sizeExpression requires at least 2 stops");
  }
  const result: any[] = ["interpolate", ["exponential", 1.5], ["zoom"]];
  for (const [zoom, size] of stops) {
    result.push(zoom, size);
  }
  return result as unknown as Expression;
}

/**
 * カテゴリ値に応じた match 式を生成する。
 * @param property - プロパティ名
 * @param mapping - カテゴリ値と出力値のマッピング
 * @param fallback - デフォルト値（省略時は null）
 * @returns match 式
 */
export function matchCategory(
  property: string,
  mapping: Record<string, any>,
  fallback?: any,
): Expression {
  const fallbackValue = fallback ?? null;
  const entries = Object.entries(mapping);
  const result: any[] = ["match", ["get", property]];

  for (const [key, value] of entries) {
    result.push(key, value);
  }

  result.push(fallbackValue);

  return result as unknown as Expression;
}
