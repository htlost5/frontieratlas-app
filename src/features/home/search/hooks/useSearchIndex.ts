// 全フロア rooms データから検索用インデックスを構築する Hook
import { useEffect, useState } from "react";

import {
  loadAllMapData,
  isCacheReady,
  getOrBuildSearchIndex,
  normalizeSearch,
} from "@/src/features/home/map/hooks/dataLoad/mapLayerCache";
import type { IndexedSearchItem } from "@/src/features/home/map/hooks/dataLoad/mapLayerCache";
import type { SearchResultItem } from "../types";

/**
 * 検索インデックスの状態
 */
type SearchIndexState =
  | { status: "loading" }
  | { status: "ready"; index: SearchResultItem[] }
  | { status: "error"; error: Error };

/**
 * キャッシュ済み正規化インデックスをクエリでフィルタする関数。
 * 並び替え用の正規化はインデックス内の normJa/normEn を使う。
 */
function filterIndex(
  indexed: IndexedSearchItem[],
  query: string,
  maxResults = 30,
): SearchResultItem[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const normalizedQuery = normalizeSearch(trimmed);

  const results = indexed.filter(
    (item) =>
      item.normJa.includes(normalizedQuery) ||
      item.normEn.includes(normalizedQuery),
  );

  // 前方一致を優先
  results.sort((a, b) => {
    const aExactJa = a.normJa === normalizedQuery ? 1 : 0;
    const bExactJa = b.normJa === normalizedQuery ? 1 : 0;
    if (aExactJa !== bExactJa) return bExactJa - aExactJa;

    const aPrefixJa = a.normJa.startsWith(normalizedQuery) ? 1 : 0;
    const bPrefixJa = b.normJa.startsWith(normalizedQuery) ? 1 : 0;
    if (aPrefixJa !== bPrefixJa) return bPrefixJa - aPrefixJa;

    const aPrefixEn = a.normEn.startsWith(normalizedQuery) ? 1 : 0;
    const bPrefixEn = b.normEn.startsWith(normalizedQuery) ? 1 : 0;
    return bPrefixEn - aPrefixEn;
  });

  return results.slice(0, maxResults).map((item) => ({
    id: item.id,
    nameJa: item.nameJa,
    nameEn: item.nameEn,
    category: item.category,
    floor: item.floor,
    coordinates: item.coordinates,
  }));
}

/**
 * 全フロアの rooms データをロードし、検索用インデックスを構築する Hook。
 * キャッシュが既に ready の場合は即座にインデックスを返す。
 */
export function useSearchIndex(): SearchIndexState {
  const [state, setState] = useState<SearchIndexState>(() => {
    if (isCacheReady()) {
      const indexed = getOrBuildSearchIndex();
      return {
        status: "ready",
        index: indexed.map((item) => ({
          id: item.id,
          nameJa: item.nameJa,
          nameEn: item.nameEn,
          category: item.category,
          floor: item.floor,
          coordinates: item.coordinates,
        })),
      };
    }
    return { status: "loading" };
  });

  useEffect(() => {
    if (state.status === "ready") return;

    let cancelled = false;

    (async () => {
      try {
        await loadAllMapData();
        if (cancelled) return;
        const indexed = getOrBuildSearchIndex();
        if (!cancelled) {
          setState({
            status: "ready",
            index: indexed.map((i) => ({
              id: i.id,
              nameJa: i.nameJa,
              nameEn: i.nameEn,
              category: i.category,
              floor: i.floor,
              coordinates: i.coordinates,
            })),
          });
        }
      } catch (e) {
        if (!cancelled) {
          setState({ status: "error", error: e as Error });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [state.status]);

  return state;
}

/**
 * インデックスとクエリを受け取り、ja/en 両方で部分一致検索する。
 * 最大 maxResults 件まで返す。正規化はキャッシュ済みインデックスを利用。
 */
export function searchIndex(
  _index: SearchResultItem[],
  query: string,
  maxResults = 30,
): SearchResultItem[] {
  const indexed = getOrBuildSearchIndex();
  if (!indexed.length) return [];
  return filterIndex(indexed, query, maxResults);
}
