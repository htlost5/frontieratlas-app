---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-18
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[configs.ts](../../../src/features/home/map/layers/floor/unit/rooms/configs.ts)"
tags:
  - IMP
  - implementation
  - TASK-compass-001
---

# Implementation Log: emergency_exit 地物ポリゴン塗りつぶし色変更

## 変更内容
`ROOM_CATEGORY_MAP` に `emergency_exit: "structure"` を追加。

- **ファイル**: `src/features/home/map/layers/floor/unit/rooms/configs.ts`
- **変更行数**: 1行追加
- **型エラー**: なし（`get_errors` 確認済）

## 変更詳細
`locker_area: "structure"` の直後に `emergency_exit: "structure"` を追加。

```typescript
locker_area: "structure",
emergency_exit: "structure",  // ← 追加
```

## 影響範囲
- 他ファイルへの変更なし
- `poiConfigs.ts` の emergency_exit シンボル定義はそのまま維持
- ポリゴンレイヤーのみの変更
