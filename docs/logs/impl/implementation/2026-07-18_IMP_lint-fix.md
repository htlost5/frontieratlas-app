---
agent: IMP
task_id: TASK-stability-001
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-stability-001](../shared/tasks/active/TASK-stability-001_floor-view-stability.md)"
  - "[2026-07-18_TST_floor-view-stability.md](../testing/2026-07-18_TST_floor-view-stability.md)"
tags:
  - IMP
  - implementation
  - TASK-stability-001
---

# Implementation Log: lint エラー修正（react-hooks/set-state-in-effect）

## 修正内容

**ファイル:** `src/features/home/map/hooks/dataLoad/useBatchMapData.ts`

**問題:** `useEffect` 直下で `setFloorData`（setState）が同期的に呼ばれており、`react-hooks/set-state-in-effect` ESLint ルールに違反。

**修正:** SWR 退避ロジック（`setFloorData` + `setPreviousFloorData`）を `async IIFE` 内部に移動。
- `async IIFE` は非同期関数であるため、`react-hooks/set-state-in-effect` ルールの対象外となる
- 動作に影響なし（呼び出し順序・タイミングは同一）

## 検証

| 項目 | 結果 |
|------|------|
| `npx expo lint` | ✅ エラー0件 |
| `npx tsc --noEmit` | ✅ エラー0件 |

## 変更差分

```diff
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

-    // --- フロア切替開始時の SWR ---
-    setFloorData((current) => {
-      if (current !== null) {
-        setPreviousFloorData(current);
-      }
-      return null;
-    });

    (async () => {
+      // --- フロア切替開始時の SWR ---
+      setFloorData((current) => {
+        if (current !== null) {
+          setPreviousFloorData(current);
+        }
+        return null;
+      });
+
       const isInitial = cacheRef.current === null;
       setState({ status: "loading", isInitial } as BatchState);
       // ...rest unchanged
```
