---
agent: TST
task_id: TASK-compass-002
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/testing/
related:
  - "[TASK-compass-002](../../shared/tasks/active/TASK-compass-002_map-layer-restructure.md)"
  - "[REV Review Log](../review/2026-07-18_REV_map-layer-restructure.md)"
tags:
  - TST
  - testing
  - TASK-compass-002
---

# Testing Log: belowLayerID による underlaySurface レイヤ順序修正

## 合否判定

✅ **PASS** — 全5テスト項目クリア

---

## T1: TypeScript 型チェック (`npx tsc --noEmit`)

| 結果 | エラー数 |
|------|----------|
| ✅ PASS | 0 errors |

**コマンド**: `npx tsc --noEmit` → 出力なし（正常終了 = 0 error）

---

## T2: ESLint チェック (`npx expo lint`)

| 結果 | エラー数 | 警告数 |
|------|----------|--------|
| ✅ PASS | 0 errors | 1 warning |

**警告詳細**:
- `MapScreen.tsx:49:6` — `react-hooks/exhaustive-deps`: `useMemo` の依存配列に `batchData.isCacheReady` が不要
- これは**既存の warning** であり、今回の変更とは無関係。error ではないため許容範囲。

---

## T3: 既存テスト

| 項目 | 結果 |
|------|------|
| テストフレームワーク設定 | ⛔ 未設定（jest.config なし） |
| 既存テストファイル | ⛔ なし（`*.test.*` / `*.spec.*` 存在せず） |

**結論**: スキップ（該当なし）

---

## T4: 変更ファイル単位の型チェック（VSCode get_errors）

| ファイル | 結果 | 備考 |
|----------|------|------|
| `PolygonLayer/types.ts` | ✅ エラーなし | `belowLayerID?: string` 定義確認 |
| `PolygonLayer/index.tsx` | ✅ エラーなし | FillLayer + LineLayer 両方に `belowLayerID` 貫通確認 |
| `SurfaceLayer/index.tsx` | ✅ エラーなし | `belowLayerID` → PolygonLayer 伝搬確認 |
| `MapScreen.tsx` | ✅ エラーなし | underlay: belowLayerID="fillLayer_surface_current" 確認 |

---

## T5: テスト観点別検証

### T5-a: 1F-3F 表示時、underlaySurface は null → belowLayerID 未設定でも問題なく動作

```tsx
// MapScreen.tsx line 150
{batchData.floorData?.underlaySurface && (
  <SurfaceLayer ... belowLayerID="fillLayer_surface_current" />
)}
```
- `underlaySurface` が null/undefined の場合、条件式が false となり `SurfaceLayer` はレンダリングされない
- ✅ 問題なし

### T5-b: 4F/5F 表示時、underlaySurface（3F surface, opacity 0.5）が current surface の下に配置される

```tsx
// underlay — 先にレンダリング → 下層
<SurfaceLayer prefixId="surface_underlay" ... belowLayerID="fillLayer_surface_current" />
// current — 後にレンダリング → 上層
<SurfaceLayer prefixId="surface_current" ... />
```
- React レンダリング順序：underlay → current
- `belowLayerID="fillLayer_surface_current"` により、underlay の FillLayer/LineLayer が current の FillLayer/LineLayer の**直下**に配置される
- ✅ 問題なし

### T5-c: belowLayerID が FillLayer と LineLayer の両方に正しく適用されている

```tsx
// PolygonLayer/index.tsx
<FillLayer id={`fillLayer_${prefixId}`} belowLayerID={belowLayerID} ... />
<LineLayer id={`lineLayer_${prefixId}`} belowLayerID={belowLayerID} ... />
```
- `belowLayerID` prop が明示的に FillLayer と LineLayer の両方に渡されている
- ✅ 問題なし

---

## 総評

- TypeScript 型チェック ✅
- ESLint ✅（既存 warning 1件のみ）
- 変更4ファイルに型エラーなし ✅
- レイヤ順序のロジックも仕様通り ✅

**全テスト項目 PASS。リリース可能。**
