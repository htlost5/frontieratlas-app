---
agent: IMP
task_id: TASK-clear-highlight-001
date: 2026-07-20
status: draft
category: log
destination: docs/logs/impl/implementation/
tags:
  - IMP
  - implementation
  - search-highlight
---

# Implementation Log: Clear Highlight Button

## Summary

検索結果ハイライトの解除導線を `MapScreen.tsx` に追加した。

## 変更内容

### 変更ファイル: `MapScreen.tsx`

**変更1 — import 追加**
- `Pressable`, `StyleSheet`, `Text`, `View` を `react-native` から追加

**変更2 — 解除ボタンの描画**
- ハイライトマーカー（`ShapeSource` / `CircleLayer`）と同じ条件（`highlightedSearchResult` が非 null かつ現在フロア）で、`MapContainer` 内の絶対配置で "✕" ボタンを表示
- `onClearHighlight`（=`MapRoot` 内の `setHighlightedSearchResult(null)`）を `onPress` にバインド
- スタイル: 白丸背景36px、青い✕アイコン、シャドウ付き。位置は右下（bottom: 90, right: 14）

### 非変更ファイル（確認済み）

- **`MapRoot.tsx`**: 既に `onClearHighlight={() => setHighlightedSearchResult(null)}` を `MapScreen` に渡している → 変更不要
- **`MapContext.tsx`**: Context 経由にする必要はなく、Props で十分 → 変更不要
- **検索選択フロー**: `MapRoot` 内の `useEffect`（selectedSearchResult → flyTo + ハイライト）に変更なし → 既存動作維持

## 動作

1. 検索結果を選択 → ハイライトマーカー + 解除ボタンが同時に表示
2. 解除ボタンを押す → `onClearHighlight` が呼ばれ `highlightedSearchResult = null` → マーカーとボタンが両方消える
3. 解除後もカメラ位置はそのまま（カメラ移動は行わない）
4. 別フロアに移動中 → 条件 `floor === batchData.currentFloor` が偽になりボタン非表示
