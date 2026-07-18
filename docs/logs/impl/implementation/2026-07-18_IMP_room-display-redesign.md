---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-18
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - IMP
  - implementation
  - TASK-compass-001
---

# Implementation Log: フロアマップ 部屋カテゴリ表示ルール再設計

## 変更概要

部屋カテゴリの配色・表示ルールを再設計。`staff` カテゴリ追加、`prep`/`meeting` の配色変更、不要カテゴリ（storage POI, atrium 表示）の非表示化。

## 変更ファイル一覧

| # | ファイル | 変更内容 |
|---|----------|----------|
| 1 | `src/features/home/map/constants/colorPalette.ts` | `RoomCategory` に `staff` 追加、`ColorGroup` に `gold`/`bronze` 追加、`ROOM_COLOR_GROUP` マッピング変更、LIGHT/DARK_THEME に gold/bronze 配色追加 |
| 2 | `src/features/home/map/layers/floor/unit/rooms/configs.ts` | `ROOM_CATEGORY_MAP`: `prep_room` → `prep`, `staff_room` → `staff` に変更。`CATEGORIES` に `staff` 追加 |
| 3 | `category.json` | `storage` の visible/poi を false に、`atrium` の visible を false に変更 |
| 4 | `src/features/home/map/layers/floor/unit/rooms/poiConfigs.ts` | `PoiCategory` から `storage` 削除、`POI_CATEGORY_MAP` から `storage` エントリ削除 |
| 5 | `src/features/home/map/renderers/MapIconRegistry.tsx` | staff-light/dark, prep-light/dark の import と ICON_IMAGES 登録を追加 |
| 6 | 新規アイコンファイル | `special-storage.png` → `prep-light.png`, `prep-dark.png` としてコピー作成 |

## 型チェック結果

- `npx tsc --noEmit` ✅ エラーなし

## 特記事項

- `prep` カテゴリのアイコンは `special-storage.png` を流用（画像アセットとしての便宜的な対応）
- `staff-light.png`, `staff-dark.png` は既存アセットとして存在
