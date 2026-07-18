---
agent: TST
task_id: TASK-stability-001
date: 2026-07-18
status: fail
category: log
destination: docs/logs/impl/testing/
related:
  - "[TASK-stability-001](../shared/tasks/active/TASK-stability-001_floor-view-stability.md)"
tags:
  - TST
  - testing
  - TASK-stability-001
---

# Test Log: FloorView 表示不安定・シンボル非表示の修正

## テスト結果

**判定: ❌ 不合格**

| 確認項目 | 結果 | 備考 |
|----------|------|------|
| `npx tsc --noEmit` | ✅ 合格 | 出力なし = 型エラー0件 |
| `npx expo lint` | ❌ 不合格 | 1 error (詳細下記) |
| `get_errors` (3ファイル) | ✅ 合格 | 全ファイルエラーなし |
| 既存テスト | ⏭️ スキップ | テストファイル未存在 |

---

## Lint エラー詳細

### ファイル: `src/features/home/map/hooks/dataLoad/useBatchMapData.ts`

```
  187:5  error  Error: Calling setState synchronously within an effect
                 can trigger cascading renders
                 react-hooks/set-state-in-effect
```

**該当コード (L187-192):**
```typescript
useEffect(() => {
    // ...
    setFloorData((current) => {
      if (current !== null) {
        setPreviousFloorData(current);
      }
      return null;
    });
```

**原因:** `useEffect` 内で `setFloorData`（setState の functional updater形式）を同期的に呼び出しており、`react-hooks/set-state-in-effect` ルールに違反。これは SWR（Stale-While-Revalidate）パターンとして意図されたコードだが、ESLint ルールにより検出されている。

---

## 環境

- `npx tsc --noEmit` → 出力なし（成功）
- `npx expo lint` → Exit code 1
- ESLint config: `eslint-config-expo/flat`（ルール継承）
- テストファイル: プロジェクト内に未存在

---

## routing

ORC → IMP（lintエラー修正後、再度REV→TSTフロー）
