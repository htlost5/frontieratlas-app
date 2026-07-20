---
agent: REV
task_id: TASK-atrium-visible-001
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-atrium-visible-001](TASK-atrium-visible-001)"
tags:
  - REV
  - review
  - TASK-atrium-visible-001
  - atrium
  - category-config
---

# Review Log: atrium visible → true

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。IMP の修正は正確で最小限。

---

## レビュー項目

### 1. 型の正しさ

- `visible: true` — ブール値として正しい
- VSCode `get_errors` で category.json にエラーなし

### 2. 他カテゴリへの影響

waste グループのメンバー:

| GeoJSON Key | ROOM_CATEGORY_MAP | visible (変更前) | visible (変更後) |
|---|---|---|---|
| fire_door | waste | true | true (不変) |
| atrium | waste | false | **true** |
| waste_room | waste | true | true (不変) |

atrium のみ visible=false→true に変化。他のカテゴリへの波及なし。

### 3. スタイル一貫性

- BaseView atrium fill: `#E0E0E0`(LIGHT) / `#2C2C2C`(DARK)
- RoomView waste (gray) fill: `#E0E0E0`(LIGHT) / `#2C2C2C`(DARK)
- **同一色値で一致** ✅

### 4. ラベル設定

- `label.icon: false, label.text: false` — 変更なし
- waste グループの `buildLabelOverrides()`: waste_room が icon=true, text=true → 既に `{iconVisible: true, textVisible: true}`
- atrium の label=false がラベル表示に影響しない ✅

### 5. パイプライン検証

`buildCategoryFilter("waste")`:

```
ROOM_CATEGORY_MAP[waste] → ["fire_door", "atrium", "waste_room"]
  → ROOM_CATEGORIES[] → ["fire_door", "atrium", "waste_room"]
  → isFeatureVisible() → 全3件通過（atrium も visible:true に）
  → waste フィルター完成
```

### 6. VSCode エラー

`get_errors` で category.json: **エラーなし**

---

## Findings

- 修正は category.json の1行のみ（`atrium.visible: false` → `true`）
- 原因分析通り、visible=false により `buildCategoryFilter("waste")` の `isFeatureVisible` で除外されていた
- 変更後は waste フィルターに atrium が含まれ、RoomView の gray レイヤーで描画される
- BaseView の atrium レイヤー（open_to_below フィルタ）と RoomView の atrium（waste → gray）の色が同一のため、表示上の違和感なし
