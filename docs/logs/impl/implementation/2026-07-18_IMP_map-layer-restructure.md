---
agent: IMP
task_id: TASK-compass-002
date: 2026-07-18
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-002](../shared/tasks/active/TASK-compass-002_compass-feature.md)"
tags:
  - IMP
  - implementation
  - TASK-compass-002
---

# Implementation Log: Map Layer Restructure

## Summary

マップレイヤ構造を抜本的に再設計し、統一キャッシュ・レイヤ順序最適化・BuildingsView 廃止を実装した。

## Changes

| ファイル | 操作 | 説明 |
|----------|------|------|
| `hooks/dataLoad/mapLayerCache.ts` | **新規作成** | モジュールスコープ単一キャッシュ。SQLite→geoJsonMap の段階的フォールバック。全5F+venue+stairsを一括ロード。4F/5FはunderlaySurfaceに3F surfaceを設定 |
| `hooks/dataLoad/useBatchMapData.ts` | 改修 | useRefキャッシュ + 複雑なpreloadAllFloorsを削除し、mapLayerCache に統一。戻り値から `buildings`, `isPreloaded` を削除 |
| `layers/buildingOutline/index.tsx` | **新規作成** | BuildingsView の代替。3F surface データを建物アウトラインとして表示。PolygonLayer 再利用 |
| `MapScreen.tsx` | 改修 | レイヤ順序を venue → surface_underlay → surface_current → stairs → FloorView(rooms) → UnitSymbol → MapIconLabel → BuildingOutlineLayer に再配置。BuildingsView 削除。BuildingOutlineLayer は 3F surface 固定表示 |
| `layers/floor/surface/index.tsx` | 改修 | prefixId prop 追加（ID重複防止） |
| `layers/floor/index.tsx` | 改修 | surface/underlay レンダリングを MapScreen に移譲。FloorViewは rooms (UnitView) のみ描画 |
| `layers/buildings/` | **削除** | BuildingsView, style.ts, types.ts を削除 |

## レイヤ順序（bottom → top）

```
1. VenueView (常時マウント)
2. SurfaceLayer_underlay (4F/5F only, opacity 0.5)
3. SurfaceLayer_current (常時マウント)
4. StairsLayer (常時マウント)
5. FloorView (rooms: BaseView + RoomView)
6. UnitSymbol
7. MapIconLabel
8. BuildingOutlineLayer (building mode のみ)
```

## キャッシュ戦略

- `mapLayerCache.ts` のモジュールスコープ変数で全データ保持
- 初回 `loadAllMapData()` で SQLite → geoJsonMap フォールバックの一括取得
- 4F/5F の underlaySurface は 3F surface を参照コピー
- `isCacheReady()`, `getMapCache()`, `invalidateCache()` を公開
- useRefキャッシュ完全廃止

## Verification

- VSCode get_errors: **0 errors** confirmed
- 既存のエクスポート/インポート関係を維持
- FloorChange, MapRoot, MapContext, colorPalette, mapConfig は未変更
