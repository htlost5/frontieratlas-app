---
agent: IMP
task_id: TASK-compass-002
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-002](../shared/tasks/active/TASK-compass-002_buildings-floor-removal.md)"
tags:
  - IMP
  - implementation
  - TASK-compass-002
---

# Implementation Log: Buildings(floor) レイヤー廃止 — CRITICAL 差し戻し修正

## 修正内容

### C001: `lineStyle` 閉じ `}` 欠落 + JSX 自己閉じタグ欠落

**ファイル**: `src/features/home/map/layers/buildings/index.tsx`

- L36: `getBuildingsLineStyle(colorTheme.buildings)` → `getBuildingsLineStyle(colorTheme.buildings)}` に修正
- `<PolygonLayer ... />` の自己閉じ `/` が欠落していたため併せて修正

### W001: 未使用引数 `variant = "dim"` 削除

**ファイル**: `src/features/home/map/layers/buildings/index.tsx`

- 関数引数の分割代入から `variant = "dim",` を削除
- Props 型から既に削除済みのため問題なし

## 検証

- `npx tsc --noEmit`: ✅ エラー0件
