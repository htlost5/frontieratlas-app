---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-001](../../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - IMP
  - implementation
  - bugfix
  - TASK-compass-001
---

# Implementation Log: processUnitData Filter Bug Fix

## Summary

`mobile/src/features/home/map/renderers/processUnitData.ts` の `processUnitData` 関数内のフィルタ条件にあったバグを修正。

## Bug

`display_point` は `[lng, lat]` という単純な配列だが、コードでは `dp.coordinates` を参照していた。これにより全 feature がフィルタで弾かれ、UnitSymbol / MapIconLabel が表示されない問題が発生していた。

## Fix

- `Array.isArray(dp.coordinates)` → `Array.isArray(dp)` に修正
- `dp.coordinates.length === 2` → `dp.length === 2` に修正

## Verification

- 型エラーなし（VSCode get_errors 確認済）

## Artifacts

- 修正ファイル: `mobile/src/features/home/map/renderers/processUnitData.ts`
