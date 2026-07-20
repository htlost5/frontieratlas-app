---
agent: IMP
task_id: TASK-search-highlight-001
date: 2026-07-20
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[MapRoot](../MapRoot.tsx)"
  - "[MapScreen](../MapScreen.tsx)"
tags:
  - IMP
  - implementation
  - search-highlight
---

# Implementation Log: Search Result Highlight Marker

## Summary

検索結果の強調表示を実装。ユーザーが検索結果を選択した際に、その位置を示す円形マーカーを地図上に表示する。

## Changes

### 1. `src/features/home/map/MapRoot.tsx`

- `SearchResultItem` の型を import
- `highlightedSearchResult` state (useState) を追加
- `selectedSearchResult` 監視 useEffect 内で、カメラ移動後に `setHighlightedSearchResult` を呼び出す（`setSelectedSearchResult(null)` より前）
- `<MapScreen>` に `highlightedSearchResult` と `onClearHighlight` props を追加

### 2. `src/features/home/map/MapScreen.tsx`

- `ShapeSource`, `CircleLayer` を import
- `SearchResultItem` 型を import
- Props に `highlightedSearchResult?: SearchResultItem | null` と `onClearHighlight?: () => void` を追加
- レイヤー最背面（MapIconLabel の後）にハイライトマーカーを追加

### マーカー構成

```
ShapeSource (search-highlight-source)
├── CircleLayer: search-highlight-outer (外周リング)
│   ├── circleRadius: 18
│   ├── circleColor: #4A90D9, opacity 0.35
│   ├── circleStrokeWidth: 3, stroke #FFFFFF, opacity 0.9
└── CircleLayer: search-highlight-inner (中芯)
    ├── circleRadius: 8
    ├── circleColor: #4A90D9, opacity 0.95
    ├── circleStrokeWidth: 2, stroke #FFFFFF, opacity 1
```

### 表示条件

- `highlightedSearchResult` が null でない
- 検索結果の `floor` が現在の `batchData.currentFloor` と一致する

## Verification

- VSCode get_errors: 両ファイルともエラーなし
- 後方互換性: `MapScreen` callers は全 optional props のため破壊なし
