---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-18
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[underlay-layer-order](../shared/tasks/active/TASK-XXX_underlay-layer-order.md)"
tags:
  - IMP
  - implementation
  - layer-order
  - underlay
---

# Implementation Log: Underlay Surface Layer Order Fix

## 問題
4F/5F 表示時、3F_surface（underlaySurface, opacity 0.5）が現在階の surface や rooms より上に描画されていた。`belowLayerID` が未指定のため、ネイティブレイヤスタックの追加順序に依存していた。

## 変更内容

### 1. `PolygonLayer/types.ts`
- `PolygonProps` に `belowLayerID?: string` を追加

### 2. `PolygonLayer/index.tsx`
- 関数引数に `belowLayerID` を追加
- `FillLayer` と `LineLayer` の両方に `belowLayerID={belowLayerID}` prop を追加

### 3. `surface/index.tsx`
- `Props` に `belowLayerID?: string` を追加
- `PolygonLayer` 呼び出しに `belowLayerID={belowLayerID}` を追加

### 4. `MapScreen.tsx`
- underlay SurfaceLayer（`prefixId="surface_underlay"`）に `belowLayerID="fillLayer_surface_current"` を指定
- これにより underlay の FillLayer/LineLayer が current surface の下に明示的に配置される

## レイヤ順序（修正後）
1. Venue（最背面）
2. **Surface underlay**（`belowLayerID="fillLayer_surface_current"` → current surface の下に配置）
3. Surface current
4. Stairs
5. FloorView (rooms)
6. ...（以降変わらず）

## 動作確認
- 全4ファイルの型エラーなし（`get_errors` 確認済）
- 既存の lint warning 1件（`batchData.isCacheReady` の不要依存 — 今回の変更とは無関係）

## 影響範囲
- 変更は minimum かつ local（PolygonLayer コンポーネント → SurfaceLayer → MapScreen の貫通のみ）
- 他のレイヤ（StairsLayer, FloorView 等）への影響なし
