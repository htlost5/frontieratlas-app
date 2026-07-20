---
agent: TST
task_id: TASK-compass-001
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/testing/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - TST
  - testing
  - TASK-compass-001
---

# Test Log: underlaySurface studyhall_surfaceback

## Test Result

**判定: ✅ 合格**

変更対象ファイル（`mapLayerCache.ts`, `MapScreen.tsx`）にエラーなし。
すべてのテスト項目をパス。

---

## Test Items

### 1. get_errors（VSCode コンパイルエラーチェック）

| ファイル | 結果 |
|---|---|
| `mapLayerCache.ts` | ✅ エラーなし |
| `MapScreen.tsx` | ✅ エラーなし |

### 2. 型チェック（npx tsc --noEmit）

変更対象ファイルに関連するエラー: **なし** ✅

> 注: `userLocation.tsx` に3件の既存型エラー（`frame` → `flame` typo）があるが、本変更とは無関係。
> 変更対象ファイル（mapLayerCache.ts, MapScreen.tsx）の型チェックは正常。

### 3. Lint（npx expo lint）

変更対象ファイルに関連するエラー: **なし** ✅

> 注: `userLocation.tsx` に unused var 警告1件（`FRAME_COLOR`）があるが、本変更とは無関係。

---

## 変更コード検証サマリ

### mapLayerCache.ts

| 確認項目 | 結果 |
|---|---|
| `ALL_MAP_IDS` に `"studyhall_surfaceback"` が追加されている | ✅ |
| 1F の `underlaySurface` は `null` | ✅ |
| 2F-5F の `underlaySurface` が `studyhall_surfaceback` に設定されている | ✅ |
| `resolveFeatureCollection` 経由でロードされる | ✅ |

### MapScreen.tsx

| 確認項目 | 結果 |
|---|---|
| コメントが `"1F以外: studyhall_surfaceback, opacity 0.5"` に更新されている | ✅ |
| `underlaySurface` の表示ロジックに変更なし（適切） | ✅ |

---

## 結論

変更は仕様通り正しく実装されており、型・コンパイル・lint すべてに問題なし。
既存の `userLocation.tsx` のエラーは本タスク範囲外であり、合格と判定する。
