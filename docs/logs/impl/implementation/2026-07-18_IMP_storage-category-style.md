---
agent: IMP
task_id: TASK-storage-style-001
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-storage-style-001](../shared/tasks/active/TASK-storage-style-001_storage-category-style.md)"
tags:
  - IMP
  - implementation
  - TASK-storage-style-001
---

# Implementation Log: storage カテゴリを locker_area と同一スタイルに統一

## 概要

`storage` カテゴリの表示設定・色グループ・POI設定を `locker_area` と完全に同じに統一した。

## 変更内容

### 1. `mobile/category.json`

| 項目 | 変更前 | 変更後 |
|------|--------|--------|
| visible | `false` | `true` |
| label.icon | `false` | `false`（変更なし） |
| label.text | `false` | `false`（変更なし） |
| poi | `false` | `true` |

### 2. `mobile/src/features/home/map/layers/floor/unit/rooms/configs.ts`

`ROOM_CATEGORY_MAP` の storage の色グループを `"waste"` → `"structure"` に変更。

- `locker_area` が既に `"structure"` にマッピングされているため、`storage` も同一グループに統一。

### 3. `mobile/src/features/home/map/layers/floor/unit/rooms/poiConfigs.ts`

- `PoiCategory` 型に `"storage"` を追加
- `POI_CATEGORY_MAP` に以下を追加:
  ```ts
  storage: {
    category: "storage",
    iconKey: "special-storage",
    sortKey: 3,
  }
  ```
  - iconKey は `locker_area` と同じ `"special-storage"` を使用

## 確認結果

- ✅ `npx tsc --noEmit` — 型エラーなし
- ✅ VSCode get_errors — 3ファイルともエラーなし
- ✅ locker_area の設定は一切未変更

## 成果物

| ファイル | 変更種別 |
|----------|----------|
| `mobile/category.json` | 設定変更（visible/poi を true に） |
| `mobile/src/features/home/map/layers/floor/unit/rooms/configs.ts` | マッピング変更（"waste" → "structure"） |
| `mobile/src/features/home/map/layers/floor/unit/rooms/poiConfigs.ts` | 型追加 + エントリ追加 |
