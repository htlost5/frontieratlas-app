---
agent: TST
task_id: TASK-atrium-label-hide-001
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/testing/
related:
  - "[REV review log]"
tags:
  - TST
  - testing
  - atrium
  - label
---

# Testing Log: Atrium Label Non-Display Fix

## Test Result

**判定: ✅ 合格**

全テスト項目を通過。CRITICAL 不具合なし。

---

## Test Items

### 1. 型チェック ✅
- Command: `npx tsc --noEmit`
- Result: エラーなし（EXIT_CODE=0）

### 2. Lint ✅
- Command: `npx expo lint`
- Result: エラーなし（EXIT_CODE=0）

### 3. VSCode get_errors ✅
- `src/features/home/map/layers/floor/unit/rooms/configs.ts`: エラーなし
- `src/features/home/map/renderers/labels/LabelConfigs.ts`: エラーなし

### 4. ロジック検証 ✅

#### 4a. `buildLabelFilter("waste")` — atrium/fire_door 除外チェック

| キー | RoomCategory | GeoJSON値 | visible | label.icon | label.text | フィルタ結果 |
|-----|-------------|-----------|---------|-----------|-----------|------------|
| `waste_room` | waste | `"waste_room"` | true | true | true | 通過 ✅ |
| `atrium` | waste | `"atrium"` | true | false | false | 除外 ✅ |
| `fire_door` | waste | `"fire_door"` | true | false | false | 除外 ✅ |

→ **ラベルフィルタ値: `["waste_room"]`** — atrim と fire_door が正しく除外される

#### 4b. `buildCategoryFilter` 維持確認
- `index.tsx` でポリゴン描画用に使用中 ✅
- `buildCategoryFilter("waste")` は従来通り `["waste_room", "fire_door", "atrium"]` の3件を含む（visible=true のみ）
- 両フィルタの役割分離が適切

#### 4c. 他のカテゴリ（structure）
- structure 配下（structure/storage/locker_area/emergency_exit/rooftop）は全件 `label={icon:false, text:false}`
- `buildLabelFilter("structure")` → 全件除外（空フィルタ）
- 意図通り動作

---

## インプレッション

- 変更は最小限（`configs.ts` に `buildLabelFilter` 追加、`LabelConfigs.ts` で呼び出し先を切替）
- 役割分離が明確: `buildCategoryFilter` → ポリゴン描画, `buildLabelFilter` → ラベル表示
- 型・Lint・ロジックすべて問題なし

---

## ファイル一覧

| ファイル | 変更内容 |
|----------|---------|
| `src/features/home/map/layers/floor/unit/rooms/configs.ts` | `buildLabelFilter` 関数を追加 |
| `src/features/home/map/renderers/labels/LabelConfigs.ts` | `buildCategoryFilter` → `buildLabelFilter` に変更 |
