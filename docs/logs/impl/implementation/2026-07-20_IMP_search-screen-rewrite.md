---
agent: IMP
task_id: TASK-search-rewrite
date: 2026-07-20
status: draft
category: log
destination: docs/logs/impl/implementation/
tags:
  - IMP
  - implementation
  - search
---

# Implementation Log: Search Screen Rewrite

## Summary

`frontieratlas/mobile/app/(tabs)/home/search.tsx` を全面的に書き換えた。

## Changes

### 追加した要素
- **TextInput**: 画面上部に `searchText`/`setSearchText` で制御される入力欄を配置（`autoFocus`, 丸角背景）
- **空クエリ対応**: `ListEmptyComponent` で `searchText` が空のときは「入力すると候補が表示されます」、検索結果ゼロのときは「検索結果がありません」を表示

### 改善した点
- **アイコン解決**: 旧実装の生の `categoryToIconKey` マッピング（重複あり）を廃止し、`ROOM_CATEGORY_MAP[category] → RoomCategory → iconKey("-light") → ICON_IMAGES` の正規チェーンで解決する `resolveIcon()` に置き換え
- **import**: `ROOM_CATEGORY_MAP`（`configs` から）、`RoomCategory` 型（`colorPalette` から）を追加。冗長な `categoryToIconKey` 内部マッピング削除

### 維持した要素
- `useSearch()` / `useSearchIndex()` / `useLiveSearch()` の Hook 構成
- `SearchResultRow` のレイアウト（左アイコン・右日本語大＋英語小の2行テキスト）
- 候補選択で `setSelectedSearchResult(item)` → `router.back()` のフロー
- 白背景、区切り線のスタイル

### 変更ファイル
| ファイル | 変更内容 |
|----------|----------|
| `app/(tabs)/home/search.tsx` | 全面的書き換え |

### 自己チェック
- [x] VSCode get_errors: No errors found
