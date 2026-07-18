---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-001]"
tags:
  - IMP
  - implementation
  - symbol-layer-prefix
---

# Implementation Log: シンボルのレイヤ構造修正 — nF_ プレフィックス付与

## 変更概要

全階共通で MapLibre のレイヤIDに階数プレフィックス `{floor}F_` を付与し、レイヤリングの一意性を確保した。

## 変更ファイル一覧

| # | ファイル | 変更内容 |
|---|----------|----------|
| 1 | `MapScreen.tsx` | `FloorView` に `floor={batchData.currentFloor}`、`UnitSymbol` に `floor={batchData.currentFloor}` prop 追加 |
| 2 | `layers/floor/types.ts` | `FloorProps` に `floor: number` 追加 |
| 3 | `layers/floor/index.tsx` | `floor` prop を受け取り `UnitView` に渡す |
| 4 | `layers/floor/unit/index.tsx` | `floor` prop を受け取り `BaseView`・`RoomView` に渡す |
| 5 | `layers/floor/unit/bases/index.tsx` | `floor` prop 追加、`prefixId` → `` `${floor}F_rooms_base_${key}` `` |
| 6 | `layers/floor/unit/rooms/index.tsx` | `floor` prop 追加、`prefixId` → `` `${floor}F_rooms_cat_${category}` `` |
| 7 | `renderers/UnitSymbol.tsx` | `floor` prop 追加、ShapeSource/SymbolLayer の id → `` `${floor}F_unit_symbol*` `` |
| 8 | `renderers/MapIconLabel.tsx` | `labelSourceId` → `` `${floor_num}F_label_view` ``、LabelLayer に `floorLayerPrefix={`` `${floor_num}F_normal` ``}` 追加 |
| 9 | `renderers/labels/shareComp.tsx` | `floorLayerPrefix?: string` prop 追加、layerId に prefix 適用 |

## レイヤ順序（bottom → top）

```
下層: nF_rooms_base/cat_*    (BaseView + RoomView: 部屋ポリゴン)
  ↓
中層: nF_unit_symbol         (UnitSymbol: トイレ・EV・階段などのPOIアイコン)
  ↓
上層: nF_normal_*            (LabelLayer: 通常ラベル)
```

## 型チェック結果

- `npx tsc --noEmit`: ✅ 合格（出力なし）
- VSCode get_errors: 全9ファイル `No errors found`
