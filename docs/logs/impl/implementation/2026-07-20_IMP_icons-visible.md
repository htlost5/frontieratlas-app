---
agent: IMP
task_id: TASK-iconsVisible-001
date: 2026-07-20
status: draft
category: log
destination: docs/logs/impl/implementation/
tags:
  - IMP
  - implementation
  - TASK-iconsVisible-001
---

# Implementation Log: Global Icon Visibility Toggle (`iconsVisible`)

## 概要
通常シンボル（MapIconLabel）のアイコン表示を全カテゴリ一括 ON/OFF するグローバル状態 `iconsVisible` を実装した。

## 変更内容

### 1. `src/features/home/map/context/MapContext.ts`
- `MapContextValue` 型に `iconsVisible: boolean` と `setIconsVisible: (v: boolean) => void` を追加

### 2. `src/features/home/map/MapRoot.tsx`
- `const [iconsVisible, setIconsVisible] = useState(true);` を追加（デフォルト true）
- `MapContext.Provider` の value に `iconsVisible` / `setIconsVisible` を含めた

### 3. `src/features/home/map/MapScreen.tsx`
- `useMapContext()` から `iconsVisible` を取得
- `<MapIconLabel>` に `iconsVisible={iconsVisible}` を追加

### 4. `src/features/home/map/renderers/MapIconLabel.tsx`
- Props に `iconsVisible: boolean` を追加
- `<LabelLayer>` に `iconsVisible={iconsVisible}` を伝播

### 5. `src/features/home/map/renderers/labels/shareComp.tsx`
- Props に `iconsVisible: boolean` を追加
- `const showIcon = iconsVisible && config.iconVisible;` を計算
- 以下3箇所を `config.iconVisible` → `showIcon` に置き換え:
  - `iconImage`
  - `textAnchor`
  - `textOffset`

## 型チェック
- `npx tsc --noEmit` → エラーなし ✅

## 制約の確認
- ✅ 特殊シンボル（UnitSymbol / POI）には手を付けていない
- ✅ `category.json` は変更なし
- ✅ `LabelConfig` 型、`LabelConfigs.ts`、`categoryDisplayConfig.ts` は変更なし
- ✅ 既存のカテゴリ別 iconVisible/textVisible の動作は維持
