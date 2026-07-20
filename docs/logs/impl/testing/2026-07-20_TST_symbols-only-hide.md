---
agent: TST
task_id: TASK-symbolsOnly-001
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/testing/
related:
  - "[TASK-symbolsOnly-001]"
  - "[REV Review Log](../review/2026-07-20_REV_symbols-only-hide.md)"
tags:
  - TST
  - testing
  - TASK-symbolsOnly-001
---

# Testing Log: シンボルのみ非表示化（zoom < 17.8）

## 総合結果

**判定: ✅ 合格**

---

## テスト項目一覧

### 1. 型チェック（get_errors: MapScreen.tsx）
- **結果**: ✅ 合格
- エラー0件

### 2. 型チェック（npx tsc --noEmit）
- **結果**: ✅ 合格
- 出力なし（正常終了、exit code 0）

### 3. Lint（npx expo lint）
- **結果**: ✅ 合格
- 出力なし（正常終了、exit code 0）

### 4. 静的検証 — visible プロパティ値

| 行 | コンポーネント | visible 値 | 期待値 | 判定 |
|---|---|---|---|---|
| 136 | VenueView | `visible={true}` | `{true}` | ✅ |
| 145 | Surface underlay | `visible={true}` | `{true}` | ✅ |
| 156 | Surface current | `visible={true}` | `{true}` | ✅ |
| 166 | StairsLayer | `visible={true}` | `{true}` | ✅ |
| 175 | FloorView | `visible={true}` | `{true}` | ✅ |
| 184 | UnitSymbol | `isVisible={isInteriorVisible ? 1 : 0}` | `isInteriorVisible`依存 | ✅ |
| 194 | MapIconLabel | `isVisible={isInteriorVisible}` | `isInteriorVisible`依存 | ✅ |

### 5. 静的検証 — isInteriorVisible 出現箇所

| 行 | 用途 | 判定 |
|---|---|---|
| 105 | `const isInteriorVisible = displayMode !== "building";`（定義） | ✅ |
| 184 | `isVisible={isInteriorVisible ? 1 : 0}`（UnitSymbol） | ✅ |
| 194 | `isVisible={isInteriorVisible}`（MapIconLabel） | ✅ |
| — | 上記3箇所以外の出現 | ✅ なし |

---

## 補足

- ErrorOverlay（fullscreen: 行96, overlay: 行116）の `visible={true}` は本タスク対象外だが、変更誤りがないことを確認済み
- BuildingOutlineLayer は既存の別タスクで MapScreen からの参照が全削除済みのため確認対象外

---

## テスト環境

- TypeScript: npx tsc --noEmit
- Linter: npx expo lint
- 静的検証: VSCode grep_search
- 対象ファイル: `src/features/home/map/MapScreen.tsx`
