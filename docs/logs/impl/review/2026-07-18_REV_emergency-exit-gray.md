---
agent: REV
task_id: TASK-compass-001
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
  - "[configs.ts](../../../../src/features/home/map/layers/floor/unit/rooms/configs.ts)"
  - "[colorPalette.ts](../../../../src/features/home/map/constants/colorPalette.ts)"
  - "[poiConfigs.ts](../../../../src/features/home/map/layers/floor/unit/rooms/poiConfigs.ts)"
  - "[filter.ts](../../../../src/features/home/map/layers/floor/unit/rooms/filter.ts)"
  - "[category.json](../../../../category.json)"
tags:
  - REV
  - review
  - TASK-compass-001
---

# Review Log: emergency_exit ポリゴン色 → グレー変更

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。変更は最小限で、全観点で問題なし。

---

## 変更内容

`configs.ts` の `ROOM_CATEGORY_MAP` に `emergency_exit: "structure"` を1行追加。

```diff
  locker_area: "structure",
+ emergency_exit: "structure",
```

---

## レビュー観点ごとの検証

### 1. 色の伝搬パス ✅

```
ROOM_CATEGORY_MAP["emergency_exit"] = "structure"   (RoomCategory)
  → ROOM_COLOR_GROUP["structure"] = "gray"           (ColorGroup)
    → colorTheme.rooms["gray"].fill / .line           (Light: #E0E0E0 / #BDBDBD, Dark: #2C2C2C / #424242)
```

伝搬に問題なし。グレー配色が正しく適用される。

### 2. `poiConfigs.ts` の emergency_exit シンボルへの影響 ✅

`POI_CATEGORY_MAP` と `ROOM_CATEGORY_MAP` は独立したマップ。
POI シンボルは `buildPoiIconImageExpression()` で動的生成 → **影響なし**。
`special-emergency-exit` アイコンは引き続き表示される。

### 3. `filter.ts` への影響確認 ✅

`ROOM_CATEGORIES.emergency_exit = "emergency_exit"` は既存定義 → 変更不要。
`buildCategoryFilter("structure")` は `ROOM_CATEGORY_MAP` から `structure` に属するキーを収集するが、
`emergency_exit` の GeoJSON 値 `"emergency_exit"` がフィルタ値に含まれるのは正しい動作。

### 4. category.json の表示設定との整合 ✅

| 設定項目 | 値 | 備考 |
|---|---|---|
| `visible` | `true` | ポリゴン表示される ✅ |
| `label.icon` | `false` | ラベルアイコン非表示（POI は別レイヤー）✅ |
| `label.text` | `false` | ラベルテキスト非表示 ✅ |
| `poi` | `true` | POI アイコン表示（シンボルレイヤー）✅ |

### 5. シンボルレイヤーとポリゴンレイヤーの分離 ✅

- ポリゴンレイヤー: `RoomView` → `PolygonLayer`（`buildCategoryFilter` 使用）
- シンボルレイヤー: POI アイコン（`buildPoiFilter` / `buildPoiIconImageExpression` 使用）
- Maplibre では独立したレイヤーとして動作 → **競合なし**

### 6. 型エラー ✅

VSCode `get_errors` 確認: **エラー0件**
`"structure"` は `RoomCategory` 型の有効な値。

### 7. 他ファイルへの影響 ✅

変更は `configs.ts` の1行のみ。他ファイルへの修正は不要。

---

## Findings

- 変更は1行追加のみで最小限
- `locker_area: "structure"` の直後に追加 → 可読性良好
- ポリゴン色と POI アイコンは独立したレイヤー管理のため干渉なし
- `category.json` の `emergency_exit.poi: true` により、グレーのポリゴン＋`special-emergency-exit` アイコンが期待通り表示される

---

## Check Items

- [x] 型エラーなし
- [x] 色伝搬パスが正しい
- [x] POI シンボルへの影響なし
- [x] シンボルレイヤーとポリゴンレイヤーの競合なし
- [x] category.json 設定との整合性
- [x] 他ファイルへの影響なし
