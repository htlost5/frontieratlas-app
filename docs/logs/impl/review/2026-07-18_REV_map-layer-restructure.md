---
agent: REV
task_id: TASK-compass-002
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-compass-002](../shared/tasks/active/TASK-compass-002_map-layer-restructure.md)"
tags:
  - REV
  - review
  - TASK-compass-002
---

# Review Log: マップレイヤ構造再設計

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。全9項目の受入条件を満たしている。

---

## 1. レイヤ順序の正しさ

### 実装順序 (MapScreen.tsx L107-L154, bottom→top)

```
1. VenueView                                   ← venue
2. SurfaceLayer (underlay, 4F/5F only)         ← 3F surface (opacity 0.5)
3. SurfaceLayer (current floor)                ← surface
4. StairsLayer                                 ← stairs
5. FloorView (→ UnitView → BaseView + RoomView) ← rooms
6. UnitSymbol                                  ← symbol
7. MapIconLabel                                ← label
8. BuildingOutlineLayer                        ← building mode
```

**判定: ✅ 要件通り `venue → surface → stairs → rooms → symbol`**

- Stairs が FloorView(rooms) より前に配置 → stairs が rooms の下層で描画される ✅
- Surface underlay → Surface current の順で連続 → 4F/5F で 3F surface が下敷きに ✅

---

## 2. データフローの正しさ

### mapLayerCache → useBatchMapData → MapScreen

| 経路 | 状態 |
|------|------|
| `loadAllMapData()` → モジュールスコープ `cache` に保存 | ✅ |
| `getMapCache()` → `cache` を返却 | ✅ |
| `toFloorGeoData(floor)` → `FloorGeoData { units, surface, underlaySurface }` | ✅ |
| 4F/5F → `underlaySurface: floor3.surface` (`mapLayerCache.ts` L91-L96) | ✅ |
| `buildingOutlineData` = `cache.floors.get(3)?.surface` (`MapScreen.tsx` L77-L80) | ✅ |

### venue / stairs の再取得防止
- `useBatchMapData` の `useEffect` は floor 変更時に再実行されるが、`setVenue(cache.venue)` は不変参照 → React bail out ✅
- key 未設定 → 再マウント発生せず ✅

### SQLite → geoJsonMap → Error の段階的フォールバック
- `resolveFeatureCollection()` (`mapLayerCache.ts` L51-L57):
  1. `batchResult.get(id)` — SQLite 取得結果
  2. `geoJsonMap[id]` — バンドル資産フォールバック
  3. `throw new Error()` — 見つからなければエラー

---

## 3. コンポーネントのマウント戦略

| コンポーネント | key | floor 依存 | 再マウントリスク |
|---|---|---|---|
| VenueView | なし | なし (batchData.venue) | ✅ なし |
| SurfaceLayer (underlay) | なし | floorData.underlaySurface | ✅ なし (4F/5F のみ) |
| SurfaceLayer (current) | なし | floorData.surface | ✅ なし |
| StairsLayer | なし | なし (batchData.stairs) | ✅ なし |
| FloorView | なし | floorData | ✅ 再レンダリングのみ |
| UnitSymbol | なし | processedUnitGeoJson | ✅ 再レンダリングのみ |
| MapIconLabel | なし | floor_num, data | ✅ 再レンダリングのみ |
| BuildingOutlineLayer | なし | buildingOutlineData | ✅ 不変 |

**判定: ✅ 不要な再マウントを引き起こす条件なし**

---

## 4. キャッシュ戦略

| 項目 | 結果 |
|------|------|
| 旧 useRef キャッシュの残存 | ✅ なし (grep 確認) |
| 旧 preloadAllFloors の残存 | ✅ なし (grep 確認) |
| モジュールスコープキャッシュへの統一 | ✅ `mapLayerCache.ts` |
| cacheStatus 状態管理 (idle/loading/ready/error) | ✅ |
| loadPromise による二重ロード防止 | ✅ |
| invalidateCache による再読込トリガー | ✅ |

---

## 5. 削除の完全性

| 項目 | 結果 |
|------|------|
| `mobile/src/features/home/map/layers/buildings/` ディレクトリ削除 | ✅ 確認済 |
| `BuildingsView` の import 残存 | ✅ なし (grep 確認) |
| その他 buildings 参照 | ✅ なし (grep 確認) |

---

## 6. コード品質

### 型チェック
- ✅ `get_errors` でエラーなし

### 命名の一貫性
- ✅ `mapLayerCache` / `useBatchMapData` / `FloorCache` / `FloorGeoData` — 命名一貫
- ✅ `BuildingOutlineLayer` / `FloorView` / `SurfaceLayer` / `VenueView` — 責務明確

### デッドコード
- ✅ コメントアウトコードなし
- ⚠️ `isFloorSwitching` が常時 `false` (`useBatchMapData.ts` L97) — 現状 unused。保留枠として許容範囲。

### 型安全性
- ⚠️ `setState({...} as BatchState)` (`useBatchMapData.ts` L75) — ランタイム安全だが型安全ではない。将来の改善余地あり。

---

## 7. エラーハンドリング

| シナリオ | 実装 | 結果 |
|----------|------|------|
| 初回ロード失敗 | ErrorOverlay fullscreen + onRetry | ✅ |
| フロア切替失敗 | ErrorOverlay overlay + dismiss + onRetry | ✅ |
| 全データ欠損 (venue/stairs) | 該当レイヤ null で非表示 (critical扱い) | ✅ |
| 部分欠損 (surface/rooms) | 該当レイヤ null で非表示 (non-critical) | ✅ |
| SQLite → geoJsonMap フォールバック | resolveFeatureCollection で実装 | ✅ |
| AbortController によるクリーンアップ | useEffect cleanup で abort | ✅ |
| stale-while-revalidate (切替時のちらつき防止) | `previousFloorData` 保持 | ✅ |

---

## 軽微な所見（改善提案・CRITICAL ではない）

1. **`isFloorSwitching` 常時 false** — `useBatchMapData.ts` L97。unused だが削除しても良い。または将来の loading indicator 用に残す。
2. **`as BatchState` キャスト** — `useBatchMapData.ts` L75。`{ status: "loading", isInitial }` の `isInitial` が `boolean` でリテラル型と不一致。ユニオン型をリテラルに厳密化するか、型アサーションを避けるリファクタリング余地あり。
3. **`buildingOutlineData` の依存配列** — `MapScreen.tsx` L80。`[batchData.isCacheReady]` のみだが、キャッシュが不変のため実害なし。

---

## 結論

全9項目の受入条件を満たし、型エラーなし、削除の完全性確認済、エラーハンドリング適切。

**承認。TST に引き継ぎます。**
