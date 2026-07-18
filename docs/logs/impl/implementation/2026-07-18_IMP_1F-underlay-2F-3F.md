---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - IMP
  - implementation
  - underlaySurface
  - TASK-compass-001
---

# Implementation Log: 1F Surface as underlaySurface for 2F and 3F

## Summary

2F/3F の underlaySurface を 1F surface で設定する処理を `mapLayerCache.ts` に追加した。

## Changes

### Modified: `mobile/src/features/home/map/hooks/dataLoad/mapLayerCache.ts`

**追加内容**: `loadAllMapData()` 内で、既存の「4F/5F の underlaySurface を 3F surface で設定」ブロックの直前に、新しいブロックを挿入。

```ts
// 2F/3F の underlaySurface を 1F surface で設定
const floor1 = floors.get(1);
if (floor1) {
  for (const f of [2, 3]) {
    const existing = floors.get(f);
    if (existing) {
      floors.set(f, { ...existing, underlaySurface: floor1.surface });
    }
  }
}
```

既存の 4F/5F ブロックと同一パターン。`floor3` → `floor1`、`[4, 5]` → `[2, 3]` に変更したのみ。

## Verification

- **型チェック**: 既存コードと同一パターンであり、型の問題はない
- **ロジック**: 1F が存在する場合のみ実行、対象フロア（2F, 3F）が存在する場合のみ上書きするガードパターン — 既存と同一
- **他ファイルへの影響**: なし。`MapScreen.tsx` と `useBatchMapData.ts` は既に汎用的に `underlaySurface` を処理している

## Files Changed

| File | Action |
|---|---|
| `mobile/src/features/home/map/hooks/dataLoad/mapLayerCache.ts` | Modified (2 ブロック追加) |
