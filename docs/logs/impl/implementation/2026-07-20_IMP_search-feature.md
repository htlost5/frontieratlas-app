---
agent: IMP
task_id: TASK-search-001
date: 2026-07-20
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-search-001]"
tags:
  - IMP
  - implementation
  - search
---

# Implementation Log: Search Feature

## 変更概要

全フロア rooms データを対象に ja/en 両方で部分一致検索できる検索機能を実装。

## 変更ファイル一覧

| ファイル | 変更内容 |
|---|---|
| `src/features/home/search/types.ts` | **新規**: `SearchResultItem` 型定義 |
| `src/features/home/search/hooks/useSearchIndex.ts` | **新規**: 全フロア rooms から検索インデックスを構築する Hook + 検索関数 |
| `src/features/home/search/hooks/useLiveSearch.ts` | **新規**: searchText 変更に応じて即時検索する Hook（150ms debounce） |
| `src/features/home/search/Context/SearchContext.tsx` | **編集**: `selectedSearchResult` / `setSelectedSearchResult` を追加 |
| `src/features/home/map/renderers/MapIconRegistry.tsx` | **編集**: `ICON_IMAGES` を export 化 |
| `src/features/home/map/components/controls/searchBar.tsx` | **編集**: ルートパスを `/search` → `/home/search` に修正 |
| `src/features/home/map/MapRoot.tsx` | **編集**: `selectedSearchResult` 監視 effect 追加（floor 移動 + flyTo） |
| `app/(tabs)/home/search.tsx` | **編集**: 全面書き換え — FlatList 候補一覧 + アイコン + ja/en 2行表示 |

## 実装詳細

### 1. SearchContext 拡張
- `selectedSearchResult: SearchResultItem | null` を追加
- 検索画面で選択時にセット → MapRoot の effect が検知して floor 移動 + flyTo

### 2. 検索インデックス (`useSearchIndex`)
- `loadAllMapData` / `getMapCache` / `processUnitData` 相当のロジックで全フロア rooms を走査
- 各 feature の `name_ja` / `name_en` / `category` / `display_point` を抽出し `SearchResultItem[]` に変換
- キャッシュ ready 時は即座にインデックスを返す

### 3. リアルタイム検索 (`useLiveSearch`)
- `searchText` を 150ms debounce してから検索
- `searchIndex()`: 正規化（小文字化 + 全角→半角 + スペース除去）後、ja/en 両方で部分一致
- 前方一致順にソート（ja 完全一致 > ja 前方一致 > en 前方一致）

### 4. MapRoot 監視 effect
- `useSearch().selectedSearchResult` を監視
- 選択時: `setFloor(targetFloor)` → `flyToSearchResult(coordinates)` | `setSelectedSearchResult(null)`

### 5. 検索画面
- `FlatList` で候補一覧を表示
- 各行: 左に `ICON_IMAGES` のカテゴリアイコン、右に上段 ja（大きめ）・下段 en（小さめ）
- 選択時: `setSelectedSearchResult(item)` → `router.back()`
- 空クエリ時は結果非表示

## 未実施/未確定事項

- なし（今回のスコープは検索機能の実装完了）

## 自己チェック

- [x] `npx tsc --noEmit` エラーなし（VSCode get_errors 確認）
- [x] 既存の home / map 表示への悪影響なし（コンテキスト変更は selectedSearchResult 追加のみ）
- [x] min 変更原則: MapRoot に effect 1つ追加のみ
