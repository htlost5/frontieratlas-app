---
agent: IMP
task_id: TASK-rooftop-001
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-rooftop-001](../shared/tasks/active/TASK-rooftop-001_rooftop-key.md)"
tags:
  - IMP
  - implementation
  - TASK-rooftop-001
---

# Implementation Log: New Room Key "rooftop"

## 概要

新しい部屋キー `rooftop` を追加。テキストラベル・アイコン・POI なし、色は `structure`（gray カラーグループ）と同じ。

## 変更ファイル

### 1. `filter.ts` — ROOM_CATEGORIES に追加

- circulation セクション末尾（`atrium` の後）に `rooftop: "rooftop"` を追加
- `RoomKey` 型が自動拡張される（`keyof typeof ROOM_CATEGORIES`）

### 2. `configs.ts` — ROOM_CATEGORY_MAP に追加

- gray グループ末尾に `rooftop: "structure"` を追加 → gray ColorGroup に所属

### 3. `category.json` — 表示設定追加

- `structure` エントリの直後に `rooftop` エントリを追加
- `visible: true`, `label: { icon: false, text: false }`, `poi: false`

## 型チェック結果

- `npx tsc --noEmit` ✅ エラーなし

## 成果物パス

- `mobile/src/features/home/map/layers/floor/unit/rooms/filter.ts`
- `mobile/src/features/home/map/layers/floor/unit/rooms/configs.ts`
- `mobile/category.json`
