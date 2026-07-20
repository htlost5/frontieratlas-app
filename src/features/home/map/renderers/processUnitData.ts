// ユニットデータから表示ポイントと名前正規化を行った GeoJSON を生成する共通ユーティリティ
import type { FeatureCollection } from "geojson";

/**
 * ユニットデータを加工し、display_point を geometry に持ち、
 * name_ja/name_en を name.ja/name.en に正規化した FeatureCollection を返す。
 * フィルタとマップを1回の走査で行い中間配列を削減。
 */
export function processUnitData(
  data: FeatureCollection | null,
): FeatureCollection | null {
  if (!data) return null;

  const processedFeatures: FeatureCollection["features"] = [];

  for (const f of data.features) {
    const dp = f.properties?.display_point;
    if (dp == null || !Array.isArray(dp) || dp.length !== 2) continue;

    const normalizedProperties = { ...f.properties };
    if (
      normalizedProperties.name_ja != null &&
      normalizedProperties.name == null
    ) {
      normalizedProperties.name = {
        ja: normalizedProperties.name_ja,
        en: normalizedProperties.name_en ?? "",
      };
    }

    processedFeatures.push({
      ...f,
      geometry: {
        type: "Point" as const,
        coordinates: dp as [number, number],
      },
      properties: normalizedProperties,
    });
  }

  return {
    ...data,
    features: processedFeatures,
  };
}
