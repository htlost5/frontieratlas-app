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
  - TASK-compass-001
---

# Implementation Log: マップGeoJSONレジストリのID不一致修正

## Summary

`useBatchMapData.ts` のランタイム論理IDが、ビルドパイプラインで生成される実際のアセットIDと命名規則不一致を起こしていたため、全6箇所を修正。

## Changes

| # | 箇所 | 修正前 | 修正後 |
|---|------|--------|--------|
| 1 | MAP_LOGICAL_IDS.studyhall | `studyhall_footprint` | `studyhall_surface` |
| 2 | MAP_LOGICAL_IDS.interact | `interact_footprint` | `interact_surface` |
| 3 | floorUnitId template | `studyhall_units_floor${floor}` | `studyhall_rooms_${floor}F` |
| 4 | floorSurfaceId template | `studyhall_surface_floor${floor}` | `studyhall_surface_${floor}F` |

## Verification

- `npx tsc --noEmit`: ✅ エラーなし
- VSCode get_errors: ✅ No errors found
- `as MapId` アサーションは維持（実際に `geojsonAssetMap.ts` のキーと一致するため型安全）

## File Modified

`src/features/home/map/hooks/dataLoad/useBatchMapData.ts`

## Confidence

**95%** — 修正内容は明確で、型チェックも通過。他ファイルへの影響なし。
