---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - IMP
  - implementation
  - TASK-compass-001
---

# Implementation Log: outdoor_space Visibility & Color Group

## Summary

`outdoor_space` カテゴリを `terrace` と同じ色グループに割り当て、可視化を有効化。fill は透過、line（枠線）のみ表示。

## Changes

### 1. `types.ts` — RoomCategory 型に `"outdoor_space"` 追加

- アルファベット順で `"nursery"` の後ろ、`"studio"` の前に追加

### 2. `mappings.ts` — ROOM_COLOR_GROUP に `outdoor_space: "terrace"` 追加

- アルファベット順で `nursery` の後ろに追加
- `terrace` グループの色トークンは既存（fill: transparent + line色）をそのまま利用

### 3. `category.json` — `visible: false` → `true`

- `label` と `poi` は元々 `false` のまま変更なし
- テキスト・アイコン・POI表示なし

## 確認

- VSCode `get_errors`: 3ファイルとも型エラーなし
- `tokens.ts` は未変更（`terrace` グループの透過fill + line色を自動継承）

## 依存

- `category.json` の `visible: true` により、フィルタリング処理で map 描画対象になる
- `ROOM_COLOR_GROUP["outdoor_space"] = "terrace"` により、色解決時に透過fill + line色が適用される
