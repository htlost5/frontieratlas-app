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

# Testing Log: マップレイヤ構造再設計

## 合否判定

✅ **PASS** — 全7テスト項目クリア

---

## T1: TypeScript 型チェック

**コマンド**: `npx tsc --noEmit`

| 結果 | エラー数 |
|------|----------|
| ✅ PASS | 0 errors |

**根拠**: 出力なし（正常終了 = 0 error）。

---

## T2: ESLint チェック

**コマンド**: `npx eslint src/features/home/map/hooks/dataLoad/mapLayerCache.ts src/features/home/map/hooks/dataLoad/useBatchMapData.ts src/features/home/map/MapScreen.tsx src/features/home/map/layers/buildingOutline/index.tsx src/features/home/map/layers/floor/surface/index.tsx src/features/home/map/layers/floor/index.tsx`

| 結果 | エラー数 | 警告数 |
|------|----------|--------|
| ✅ PASS | 0 errors | 1 warning |

**警告詳細**:
- `MapScreen.tsx:49:6` — `react-hooks/exhaustive-deps`: `useMemo` の依存配列に `batchData.isCacheReady` が不要
- これは warning（error なし）のため許容範囲

---

## T3: VSCode get_errors（診断チェック）

**対象ファイル**: 変更6ファイル + 参照ファイル

| ファイル | 結果 |
|----------|------|
| `MapScreen.tsx` | ✅ No errors |
| `mapLayerCache.ts` | ✅ No errors |
| `useBatchMapData.ts` | ✅ No errors |
| `buildingOutline/index.tsx` | ✅ No errors |
| `floor/surface/index.tsx` | ✅ No errors |
| `floor/index.tsx` | ✅ No errors |

**根拠**: get_errors ツールで全6ファイル確認済。0 error。

---

## T4: 削除の完全性確認

### 4-a: buildings/ ディレクトリの実体

| 確認項目 | 結果 |
|----------|------|
| `layers/buildings/` ディレクトリ存在 | ✅ 存在しない（削除完了） |

**根拠**: `ls -la` で "No such file or directory" 確認。Git 差分でも 3 files deleted (101 lines) 確認済。

### 4-b: 残存 import の grep 検索

| 検索パターン | 該当ファイル | 結果 |
|-------------|-------------|------|
| `from.*layers/buildings` | 0 files | ✅ 残存なし |
| `from.*buildings/` | 0 files | ✅ 残存なし |
| `BuildingsView` | 1 file（`buildingOutline/index.tsx` のコメントのみ） | ✅ コード参照なし |
| `buildingFloor`（colorPalette プロパティ） | 0 files | ✅ 削除完了 |

### 4-c: LayerSwitch の残存 import

| 確認項目 | 結果 |
|----------|------|
| `from.*LayerSwitch` の import | 0 files | ✅ 残存なし |
| `LayerSwitch.tsx` ファイル自体は存在 | ✅ 未使用だがファイル削除対象外 |

---

## T5: キャッシュ統合の検証

| 確認項目 | 結果 | 根拠 |
|----------|------|------|
| `useBatchMapData.ts` に `useRef` キャッシュ残存なし | ✅ | `useRef` は `prevRetryKeyRef`（retryKey 追跡用）のみ。データキャッシュ用途の useRef なし |
| `preloadAllFloors` 関数が存在しない | ✅ | grep で該当なし |
| `mapLayerCache.ts` がモジュールスコープキャッシュを export | ✅ | モジュールレベルの `let cache: MapLayerCache | null = null` を宣言。`getMapCache()` で公開。`loadAllMapData()` で一括ロード |

**補足**: `useBatchMapData.ts` の useRef は `prevRetryKeyRef`（retryKey 変更検出用）のみで、データキャッシュ用途ではない。

---

## T6: レイヤ順序の検証

`MapScreen.tsx` の JSX 構造（bottom → top）:

| 順序 | レイヤ | 条件 | コード上の位置 |
|------|--------|------|---------------|
| 1 | MapContainer | 常時 | ラッパーコンポーネント |
| 2 | VenueView | `batchData.venue` あり | 最初の子要素 |
| 3 | SurfaceLayer underlay | 4F/5F 時（`underlaySurface` あり） | 2番目の子要素 |
| 4 | SurfaceLayer current | `surface` あり | 3番目の子要素 |
| 5 | StairsLayer | `batchData.stairs` あり | 4番目の子要素 |
| 6 | FloorView | `floorData` あり | 5番目の子要素 |
| 7 | UnitSymbol | `units` あり | 6番目の子要素 |
| 8 | MapIconLabel | `units` あり | 7番目の子要素 |
| 9 | BuildingOutlineLayer | `buildingOutlineData` あり & `showBuildings` | 8番目の子要素 |

**確認結果**: ✅ 要求順序（venue → surface → stairs → rooms → symbol → label → buildingOutline）と一致。コメントにもレイヤ順序が明記されている。

**注意点**: BuildingOutlineLayer はコメント上「8」だがコード上は最後の子要素であり、ラベルの上に描画される。building モード時のみ表示のため、通常表示ではラベルが最前面となる。

---

## T7: 既存機能のリグレッションチェック

| ファイル | 変更状態 | 結果 |
|----------|---------|------|
| `FloorChange.tsx` | 未変更（git diff 件数0） | ✅ |
| `MapRoot.tsx` | 未変更（git diff 件数0） | ✅ |
| `MapContext.ts` | 未変更（git diff 件数0） | ✅ |
| `colorPalette.ts` | **変更あり**（`buildingFloor` 削除） | ✅ 意図された変更 |
| `mapConfig.ts`（`config/index.ts`） | 未変更（git diff 件数0） | ✅ |

**補足**: `colorPalette.ts` の変更は BuildingsView 削除に伴う `buildingFloor` プロパティ削除であり、IMP タスクの一部として意図されたもの。全参照元も `buildingFloor` 削除済みで、整合性に問題なし。

---

## 総括

| # | テスト項目 | 結果 |
|---|-----------|------|
| T1 | TypeScript 型チェック | ✅ PASS |
| T2 | ESLint チェック | ✅ PASS（1 warning のみ） |
| T3 | VSCode get_errors | ✅ PASS |
| T4 | 削除の完全性確認 | ✅ PASS |
| T5 | キャッシュ統合の検証 | ✅ PASS |
| T6 | レイヤ順序の検証 | ✅ PASS |
| T7 | リグレッションチェック | ✅ PASS |

**総合判定**: ✅ **PASS**

CRITICAL レベルの問題なし。全テスト項目をクリア。`buildingOutlineData` が BuildingOutlineLayer より後ろに描画される点（ラベルの上に建物輪郭）は設計意図どおりで問題ない。
