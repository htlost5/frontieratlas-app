---
agent: IMP
task_id: TASK-terrace-001
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/implementation/
tags:
  - IMP
  - implementation
  - TASK-terrace-001
---

# Implementation Log: terrace カテゴリのマップ表示ロジック

## 概要

新カテゴリ `terrace` をマップ表示パイプラインに追加。テキスト表示のみ（text_only）、無色 fill + 枠色のみのスタイル。

## 変更ファイル

### 1. `src/features/home/map/layers/floor/unit/rooms/filter.ts`
- `ROOM_CATEGORIES` に `terrace: "terrace"` を追加（`courtyard` 直後）

### 2. `src/features/home/map/constants/colorPalette.ts`
- `RoomCategory` 型に `"terrace"` 追加
- `ColorGroup` 型に `"terrace"` 追加
- `ROOM_COLOR_GROUP` に `terrace: "terrace"` 追加
- `LIGHT_THEME.rooms` に terrace パレット追加（fill透明, line:#8A9A7B）
- `DARK_THEME.rooms` に terrace パレット追加（fill透明, line:#6B7A5E）

### 3. `src/features/home/map/layers/floor/unit/rooms/configs.ts`
- `ROOM_CATEGORY_MAP` に `terrace: "terrace"` 追加
- `CATEGORIES` 配列に `"terrace"` 追加
- `getDisplayMode()` で `terrace` も `"text_only"` を返すよう条件追加

## 検証結果
- VSCode get_errors: 全3ファイルで型エラーなし
- 型整合性: RoomCategory / ColorGroup / CATEGORIES すべてに terrace が追加されていることを確認
