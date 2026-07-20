---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-20
status: draft
category: shared
destination: shared/impl/
tags:
  - IMP
  - handoff
  - TASK-compass-001
---

# HANDOFF: IMP → REV — underlaySurface studyhall_surfaceback

## Status

status: ✅ 成功
confidence: high (エラーなし、既存アセット使用)

## Key Changes

### File 1: `src/features/home/map/hooks/dataLoad/mapLayerCache.ts`

1. `ALL_MAP_IDS` に `"studyhall_surfaceback"` を追加
2. 2F/3F の underlaySurface を 1F surface で設定するブロックを **削除**
3. 4F/5F の underlaySurface を 3F surface で設定するブロックを **削除**
4. `resolveFeatureCollection` で `studyhall_surfaceback` をロードし、2F〜5F の全フロアの `underlaySurface` に設定するブロックを **追加**

### File 2: `src/features/home/map/MapScreen.tsx`

- 154行目のコメント更新のみ。ロジックの変更なし。

## Artifacts

- 実装ログ: `docs/logs/impl/implementation/2026-07-20_IMP_underlaySurface-studyhall-surfaceback.md`

## Verification

- ✅ `get_errors` で両ファイルともコンパイルエラーなし
- ✅ `geojsonAssetMap.ts` に `studyhall_surfaceback` が既に定義済みであることを確認

## Open Questions

なし

## Routing

→ **REV** に委譲（CRITICAL 差し戻し発生時のみ ORC にエスカレーション）
