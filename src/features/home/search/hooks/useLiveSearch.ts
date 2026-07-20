// リアルタイム検索 Hook: useSearchIndex のインデックスと searchText を組み合わせて候補を生成
import { useMemo, useDeferredValue } from "react";
import { useSearch } from "../Context/SearchContext";
import { searchIndex } from "./useSearchIndex";
import type { SearchResultItem } from "../types";

type LiveSearchState =
  | { status: "loading" }
  | { status: "ready"; results: SearchResultItem[] }
  | { status: "error"; error: string };

/**
 * searchText の変更に応じてリアルタイムに候補一覧を更新する Hook。
 * useDeferredValue により入力を低優先度化し、手動 debounce を排除。
 * インデックス構築前は loading 状態を返す。
 * 空クエリ時は results: [] を返す。
 */
export function useLiveSearch(
  indexState:
    | { status: "loading" }
    | { status: "ready"; index: SearchResultItem[] }
    | { status: "error"; error: Error },
): LiveSearchState {
  const { searchText } = useSearch();
  const deferredQuery = useDeferredValue(searchText);

  const state = useMemo<LiveSearchState>(() => {
    if (indexState.status === "loading") {
      return { status: "loading" };
    }
    if (indexState.status === "error") {
      return { status: "error", error: indexState.error.message };
    }

    const trimmed = deferredQuery.trim();
    if (!trimmed) {
      return { status: "ready", results: [] };
    }

    const results = searchIndex(indexState.index, trimmed);
    return { status: "ready", results };
  }, [indexState, deferredQuery]);

  return state;
}
