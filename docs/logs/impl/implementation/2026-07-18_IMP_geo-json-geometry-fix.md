---
agent: IMP
task_id: TASK-compass-002
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-002](../shared/tasks/active/TASK-compass-002_geo-json-geometry-fix.md)"
tags:
  - IMP
  - implementation
  - TASK-compass-002
---

# Implementation Log: GeoJSON Geometry Fix in processUnitData

## 修正内容

`processUnitData.ts` の `geometry` 代入を修正。

### 修正前（バグ）

```typescript
geometry: f.properties.display_point,
```

`display_point` は `[lng, lat]` 配列だが、GeoJSON Feature の `geometry` は Geometry オブジェクトが必要。

### 修正後

```typescript
geometry: {
  type: "Point" as const,
  coordinates: f.properties.display_point as [number, number],
},
```

## 検証結果

| 項目 | 結果 |
|------|------|
| `npx tsc --noEmit` | ✅ PASS（出力なし） |
| `npx expo lint` | ✅ PASS（0 errors, 3 warnings=既存） |
| `get_errors` | ✅ PASS |

## 変更ファイル

- `mobile/src/features/home/map/renderers/processUnitData.ts` — 1箇所修正
