---
agent: IMP
task_id: TASK-stability-001
date: 2026-07-18
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-stability-001](../shared/tasks/active/TASK-stability-001_floor-view-stability.md)"
tags:
  - IMP
  - implementation
  - TASK-stability-001
---

# Implementation Log: FloorView 表示不安定・シンボル非表示の修正

## 変更概要

3ファイルを修正。バグ修正（modification）のため設計変更なし。

### 1. FullScreenLoading.tsx
- **問題**: 不透明背景 (#F6F7F9) が MapContainer を完全隠蔽
- **修正**: 
  - `backgroundColor` を `rgba(246, 247, 249, 0.5)` に変更（半透明化）
  - `<View>` に `pointerEvents="none"` を追加（マップ操作をブロックしない）

### 2. useBatchMapData.ts
- **問題**: stale-while-revalidate の実装ミス
  - `previousFloorData` がロード完了後に常に新データで上書きされていた
  - プリロードキャッシュ非ヒット時のみ `isFloorSwitching=true` になり毎回ローディング表示
- **修正A**: フロア切替開始時に `setFloorData` の関数型更新で現在の floorData を previous に退避し、floorData を null にクリア
- **修正B**: ロード完了時の `setPreviousFloorData(newFloorData)` を削除（切替開始時に設定済のため）
- **修正C**: `isFloorSwitching` を常に false に（SWR により前フロアデータ表示継続のためローディングオーバーレイ不要）

### 3. MapScreen.tsx
- **修正A**: `batchData.isFloorSwitching` による `<FullScreenLoading message="フロア切替中...">` ブロックを削除
- **修正B**: `processedUnitGeoJson` の useMemo にデバッグログを追加（シンボル件数確認用）
- **修正C**: `<UnitSymbol>` と `<MapIconLabel>` のレンダリング条件を `batchData.floorData` → `batchData.floorData?.units` に強化（units が null のときに空シンボルが表示される問題を修正）

## 型チェック結果
- `npx tsc --noEmit`: ✅ エラー0件
- `get_errors`: ✅ 全ファイルエラーなし
