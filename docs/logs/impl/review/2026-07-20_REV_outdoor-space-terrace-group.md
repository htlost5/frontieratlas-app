---
agent: REV
task_id: TASK-outdoor-space-terrace
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[outdoor_space → terrace グループ設定](../shared/tasks/active/TASK-outdoor-space-terrace.md)"
tags:
  - REV
  - review
  - outdoor_space
  - terrace
---

# Review Log: outdoor_space → terrace 色グループ設定

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。全5観点で問題なし。型エラーも存在しない。

---

## 変更ファイル一覧

| # | ファイル | 変更内容 |
|---|----------|----------|
| 1 | `src/features/home/map/constants/colorPalette/types.ts` | `RoomCategory` に `"outdoor_space"` を追加 |
| 2 | `src/features/home/map/constants/colorPalette/mappings.ts` | `ROOM_COLOR_GROUP` に `outdoor_space: "terrace"` を追加 |
| 3 | `category.json` | `outdoor_space.visible` を `false` → `true` に変更 |

---

## 1. 型の正しさ ✅

- `RoomCategory` ユニオン型に `"outdoor_space"` が追加され、`"nursery"` と `"studio"` の間に正しい位置で挿入されている
- `ROOM_COLOR_GROUP: Record<RoomCategory, ColorGroup>` に `outdoor_space: "terrace"` が追加されている
- `"terrace"` は `ColorGroup` ユニオン型に含まれる
- `Record<RoomCategory, ColorGroup>` の全網羅性が保たれていることを `get_errors` で確認 → 型エラーなし

## 2. 色継承の正しさ ✅

`outdoor_space → "terrace"` グループの継承連鎖:

| トークン | fill | line |
|----------|------|------|
| LIGHT `terrace` | `rgba(0,0,0,0)` (透過) | `#8A9A7B` (緑系) |
| DARK `terrace` | `rgba(0,0,0,0)` (透過) | `#6B7A5E` (緑系) |

- **fill: 透過** → outdoor_space が建物形状を隠さず、線のみで区画を示す意図と合致
- **line: 緑系** → terrace と同じ色。屋外空間として統一感あり
- LIGHT/DARK 両方で透過fillが設定されている ✅

## 3. 表示設定の一貫性 ✅

`category.json` の `outdoor_space`:

```json
"outdoor_space": {
  "visible": true,
  "label": { "icon": false, "text": false },
  "poi": false
}
```

- `visible: true` → 地図上に表示される
- `label.icon: false, label.text: false` → テキスト・アイコン非表示（屋外空間のため適切）
- `poi: false` → POI 対象外（屋外スペース名を検索対象にしない）

terrace (`label.text: true`) と違い、outdoor_space はラベル非表示。これは屋外の通路的スペースとしての要件に合致。

## 4. filter.ts との整合性 ✅

`filter.ts` の `ROOM_CATEGORIES`:
```js
outdoor_space: "outdoor_space"
```
既存定義で変更不要。category.json のキー `"outdoor_space"` と GeoJSON の category 値 `"outdoor_space"` のマッピングが一致している。他カテゴリとの競合なし。

## 5. tokens.ts 変更不要の妥当性 ✅

terrace グループの色定義は既に tokens.ts に存在：
- `LIGHT_TOKENS.rooms.terrace`: 透過fill + `#8A9A7B` line
- `DARK_TOKENS.rooms.terrace`: 透過fill + `#6B7A5E` line

透過fill + 緑系line の組み合わせは outdoor_space にもそのまま適用可能であり、新規カラートークン追加は不要。

---

## 総評

3ファイルの変更は最小限で、型安全性・色継承・表示設定のすべてで正しい。CRITICAL な問題はなく、即座に TST へ引き継ぎ可能。
