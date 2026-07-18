---
agent: REV
task_id: TASK-stability-001
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-stability-001](../shared/tasks/active/TASK-stability-001_floorview-stability.md)"
tags:
  - REV
  - review
  - TASK-stability-001
---

# Review Log: FloorView 表示不安定・シンボル非表示の修正

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。全レビューポイントを通過。コードは仕様通り正しく実装されている。

---

## レビューポイント確認

### FullScreenLoading.tsx

| # | 項目 | 結果 |
|---|------|------|
| 1 | 背景 `rgba(246, 247, 249, 0.5)` | ✅ line 23 に設定 |
| 2 | `pointerEvents="none"` がルート View に付与 | ✅ line 11 に設定 |

### useBatchMapData.ts

| # | 項目 | 結果 |
|---|------|------|
| 3 | 関数型更新で `previousFloorData` に退避 | ✅ lines 180-185 で実装。`setFloorData((current) => { ... setPreviousFloorData(current); return null; })` |
| 4 | ロード完了時に `setPreviousFloorData` が呼ばれていない | ✅ lines 270-275 に呼び出しなし |
| 5 | `isFloorSwitching` が常に `false` | ✅ line 301: `const isFloorSwitching = false;` |
| 6 | `displayFloorData = floorData ?? previousFloorData` | ✅ line 304。切替中は previousFloorData 表示、完了後は新しい floorData 表示 |

### MapScreen.tsx

| # | 項目 | 結果 |
|---|------|------|
| 7 | `isFloorSwitching && FullScreenLoading` ブロック削除 | ✅ 該当コードなし。State 3 は直接 MapContainer をレンダリング |
| 8 | UnitSymbol が `batchData.floorData?.units && processedUnitGeoJson` でガード | ✅ line 139 |
| 9 | MapIconLabel が `batchData.floorData?.units` でガード | ✅ line 145 |
| 10 | デバッグ `console.log` | ✅ 2件残置（`[UnitSymbol]` line 67, `[zoom]` line 86）。実運用への悪影響なし |

### 型チェック

| # | ファイル | 結果 |
|---|---------|------|
| - | FullScreenLoading.tsx | ✅ No errors |
| - | useBatchMapData.ts | ✅ No errors |
| - | MapScreen.tsx | ✅ No errors |

---

## 考察

### SWR パターンの正しさ

`setFloorData` の関数型更新 (`(current) => ...`) を使用しているため、React 18 の concurrent mode 下でも stale closure を回避できている。閉じた Effect のコールバック内で最新の `floorData` ではなく `current` パラメータを参照する設計が正しい。

### floorData の表示ロジック

`displayFloorData = floorData ?? previousFloorData`:

1. **通常時**: `floorData` が非 null → 該当フロアのデータを表示
2. **切替開始直後**: `floorData = null`、`previousFloorData` に旧フロアデータ → 旧フロアデータを保持
3. **切替完了**: `floorData` に新データセット → 新データを表示（previousFloorData はそのまま保持）

→ 二重設定防止のため、完了時に `setPreviousFloorData` を呼ばないことで、切替中のみ previous が参照される状態を維持している。

### UnitSymbol / MapIconLabel のガード

`batchData.floorData`（= `displayFloorData`）は切替中も previousFloorData を返すため、シンボルが一瞬消えることはない。また、previousFloorData にも units があれば表示され続ける。

---

## 指摘事項リスト

CRITICAL 指摘なし。

軽微な所感:
- `console.log` 2件が残置されている。削除してもよいが、今後のデバッグに有用であれば維持可。
- 現状のコードで機能面・パフォーマンス面の問題はなし。
