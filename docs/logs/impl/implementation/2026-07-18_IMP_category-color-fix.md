---
agent: IMP
task_id: TASK-category-color-001
date: 2026-07-18
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-category-color-001](../shared/tasks/active/TASK-category-color-001.md)"
tags:
  - IMP
  - implementation
  - TASK-category-color-001
---

# Implementation Log: 地物カテゴリ表示形式・色修正

## 概要
prep_room を POI アイコン専用から classroom と同様のピン+テキストラベル表示に変更。vending を visible=true に変更。未定義だった polygon fill 色グループ（cyan/salmon/indigo/lime）を追加。

## 編集内容

### 1. `mobile/category.json`
- **prep_room**: `label.icon: true, label.text: true, poi: false` に変更（classroom と同形式）
- **vending**: `visible: false` → `visible: true`

### 2. `mobile/src/features/home/map/constants/colorPalette.ts`
- `RoomCategory` 型に `"prep" | "restroom" | "vending" | "changing" | "elevator"` 追加
- `ColorGroup` 型に `"cyan" | "salmon" | "indigo" | "lime"` 追加
- `ROOM_COLOR_GROUP` に5エントリ追加（prep→purple, restroom→cyan, vending→salmon, changing→indigo, elevator→lime）
- `LIGHT_THEME.rooms` に4色追加
- `DARK_THEME.rooms` に4色追加

### 3. `mobile/src/features/home/map/layers/floor/unit/rooms/configs.ts`
- `ROOM_CATEGORY_MAP` に10エントリ追加:
  - prep_room→laboratory, male_restroom→restroom, female_restroom→restroom, accessible_restroom→restroom, changing_room→changing, elevator→elevator, vending→vending, structure→waste, fire_door→waste, storage→waste, atrium→waste
- `CATEGORIES` 配列に `"prep", "restroom", "vending", "changing", "elevator"` 追加

### 4. `mobile/src/features/home/map/layers/floor/unit/rooms/poiConfigs.ts`
- `PoiCategory` 型から `"prep_room"` 削除
- `POI_CATEGORY_MAP` から `prep_room` エントリ削除

## 型チェック
- 4ファイルともエラーなし（VSCode get_errors 確認済）
