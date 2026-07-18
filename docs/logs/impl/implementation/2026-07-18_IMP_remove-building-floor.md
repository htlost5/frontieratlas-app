---
agent: IMP
task_id: TASK-compass-002
date: 2026-07-18
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-002](../../shared/tasks/active/TASK-compass-002_remove-building-floor.md)"
tags:
  - IMP
  - implementation
  - TASK-compass-002
---

# Implementation Log: Remove Buildings(floor) Layer

## 変更概要

Buildings(floor) レイヤーを廃止し、関連コードを完全削除した。`BuildingsView` は `dim` 専用に単純化。

## 変更ファイル

| # | ファイル | 変更内容 |
|---|----------|----------|
| 1 | `src/features/home/map/MapScreen.tsx` | BuildingsView variant="floor" ブロック削除 |
| 2 | `src/features/home/map/layers/buildings/index.tsx` | variant prop・isFloor 分岐・floor 用 prefix 削除、import 整理 |
| 3 | `src/features/home/map/layers/buildings/style.ts` | getBuildingFloorFillStyle / getBuildingFloorLineStyle 削除 |
| 4 | `src/features/home/map/constants/colorPalette.ts` | ColorTheme.buildingFloor、LIGHT_THEME.buildingFloor、DARK_THEME.buildingFloor 削除 |

## 検証結果

- `get_errors` → 型エラーなし
- `grep "buildingFloor"` → 該当ファイル外に参照なし

## 引き継ぎ

成果物を REV にハンドオフする。CRITICAL 指摘発生時のみ ORC にエスカレーション。
