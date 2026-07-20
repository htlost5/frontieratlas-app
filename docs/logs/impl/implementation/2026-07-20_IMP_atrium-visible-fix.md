---
agent: IMP
task_id: TASK-atrium-visible-001
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-atrium-visible-001](../shared/tasks/active/TASK-atrium-visible-001.md)"
tags:
  - IMP
  - implementation
  - atrium
  - category-config
---

# Implementation Log: atrium.visible → true

## 修正内容

`category.json` の `atrium.visible` を `false` → `true` に変更。

### 変更ファイル

- `category.json`: `"visible": false` → `"visible": true`（atrium セクション）

### 変更行

```diff
 "atrium": {
-  "visible": false,
+  "visible": true,
   "label": { "icon": false, "text": false },
   "poi": false
 },
```

## 自己チェック結果

| 項目 | 結果 |
|------|------|
| VSCode エラー（`get_errors`） | ✅ エラーなし |
| TypeScript 型チェック（`npx tsc --noEmit`） | ✅ 出力なし |
| ESLint（`npx expo lint`） | ✅ 出力なし |

## データフロー確認

- GeoJSON `category: "atrium"` → ROOM_CATEGORIES.atrium → ROOM_CATEGORY_MAP → "waste" → ROOM_COLOR_GROUP → "gray"
- isFeatureVisible("atrium") → visible=true → 描画対象となる
- waste フィルターから除外されず、gray 色（`#E0E0E0`/`#2C2C2C`）で描画される

## 備考

BaseView (bases) 側の BASE_CATEGORIES.atrium = "open_to_below" 不整合は本修正の対象外。
