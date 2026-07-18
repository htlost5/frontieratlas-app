---
agent: REV
task_id: TASK-compass-001
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - REV
  - review
  - bugfix
  - TASK-compass-001
---

# Review Log: processUnitData Filter Bug Fix

## Review Result

**判定: ✅ 承認 (approved)**

CRITICAL 指摘なし。修正は正しく、仕様通り実装されている。

---

## Review Items

### 1. 修正内容の検証

| 項目 | 結果 |
|------|------|
| 修正ファイル | `mobile/src/features/home/map/renderers/processUnitData.ts` |
| 修正行 | filter 内の条件判定（1箇所） |
| 変更前 | `Array.isArray(dp.coordinates) && dp.coordinates.length === 2` |
| 変更後 | `Array.isArray(dp) && dp.length === 2` |

**考察**: `display_point` は `[lng, lat]` 形式の単純な配列であり、`dp.coordinates` は存在しない。
修正後の `Array.isArray(dp) && dp.length === 2` が正しい判定となる。

### 2. データ構造の確認

実データ例（`tools/map-assets/build/imdf/interact/surface/1F.json`）:
```json
"display_point": [139.67804065424022, 35.49779557064088]
```

- `display_point` は `[lng, lat]` の2要素配列 ✅
- `dp.coordinates` → `undefined`（修正前は全件フィルタアウトの原因） ✅

### 3. 型チェック

- `get_errors`: エラーなし ✅
- `npx tsc --noEmit`: エラーなし ✅

### 4. Lint

- `npx expo lint`: 0 errors ✅（3 warnings は既存・他ファイルのもの）

### 5. 型ガード

- フィルタの型述語 `f is typeof f & { properties: NonNullable<typeof f.properties> }` に変更なし ✅

### 6. 呼び出し側への影響

- `useProcessedUnitData` → `MapIconLabel` で使用
- 戻り値型 `FeatureCollection | null` は不変 ✅
- 影響範囲は限定されており、他ファイルへの変更不要 ✅

---

## Findings

- 修正は2行の変更で最小限
- バグ原因は `display_point` が単純な `[lng, lat]` 配列であるのに対し、座標のネストを誤想定していたこと
- コンパイルエラーにならないランタイムバグのためテストでは発見されにくいパターン
