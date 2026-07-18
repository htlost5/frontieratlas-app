---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-18
status: pending
category: shared
destination: _inbox/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - IMP
  - REV
  - handoff
  - TASK-compass-001
---

# HANDOFF: IMP → REV

## Status

✅ 成功 — 全6箇所のID不一致を修正完了

## Confidence

**95%**（型チェック通過、他ファイル影響なし）

## Artifacts

| 成果物 | パス |
|--------|------|
| 修正ファイル | `src/features/home/map/hooks/dataLoad/useBatchMapData.ts` |
| 実装ログ | `docs/logs/impl/implementation/2026-07-18_IMP_map-geojson-id-fix.md` |

## Changes Summary

| # | 箇所 | 修正前 → 修正後 |
|---|------|-----------------|
| 1 | `MAP_LOGICAL_IDS.studyhall` | `studyhall_footprint` → `studyhall_surface` |
| 2 | `MAP_LOGICAL_IDS.interact` | `interact_footprint` → `interact_surface` |
| 3 | `floorUnitId()` テンプレート | `studyhall_units_floor${floor}` → `studyhall_rooms_${floor}F` |
| 4 | `floorSurfaceId()` テンプレート | `studyhall_surface_floor${floor}` → `studyhall_surface_${floor}F` |

## REV 確認依頼項目

1. **6箇所すべての置換が正しいか** — 上記4行に加え、`preloadAllFloors()` 内の `floorUnitId()` / `floorSurfaceId()` 呼び出し（L93-94, L98-99）が変更後の関数を正しく参照しているか
2. **型エラーがないか** — `npx tsc --noEmit` は通過済みだが再確認推奨
3. **残余の `as MapId` アサーションの要否判断** — 4箇所で `as MapId` を使用中。置換後のIDはすべて `geojsonAssetMap.ts` のキーに実在するため型安全だが、削除するかどうかは REV 判断に委ねる

## Open Questions

なし — 全IDは `geojsonAssetMap.ts` および `manifest.json` に実在確認済み。

## Routing

```yaml
next: REV
on_critical_escalation: ORC
on_approval: TST
final_report: ORC
```
