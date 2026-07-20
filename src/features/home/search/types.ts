// 検索機能の型定義
// 検索結果として表示する部屋情報の型

/**
 * 検索結果 1エントリ
 * @property id - 部屋の一意ID
 * @property nameJa - 日本語名
 * @property nameEn - 英語名
 * @property category - GeoJSON カテゴリ値（例: "laboratory", "classroom"）
 * @property floor - フロア番号
 * @property coordinates - display_point 座標 [lng, lat]
 */
export type SearchResultItem = {
  id: string;
  nameJa: string;
  nameEn: string;
  category: string;
  floor: number;
  coordinates: [number, number];
};
