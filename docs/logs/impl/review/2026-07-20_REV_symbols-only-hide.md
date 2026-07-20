---
agent: REV
task_id: TASK-symbolsOnly-001
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-symbolsOnly-001]"
tags:
  - REV
  - review
  - TASK-symbolsOnly-001
---

# Review Log: シンボルのみ非表示化（zoom < 17.8）

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。コードは仕様通り正しく実装されている。

---

## レビュー項目

### 1. VenueView / Surface underlay / Surface current / StairsLayer / FloorView の `visible`

| コンポーネント | 行 | visible 値 | 判定 |
|---|---|---|---|
| VenueView | 136 | `visible={true}` | ✅ |
| Surface underlay | 145 | `visible={true}` | ✅ |
| Surface current | 156 | `visible={true}` | ✅ |
| StairsLayer | 166 | `visible={true}` | ✅ |
| FloorView | 175 | `visible={true}` | ✅ |

全5コンポーネントが `visible={true}`（常時表示）に設定されている。

---

### 2. UnitSymbol / MapIconLabel の `visible` が `isInteriorVisible` のまま維持

| コンポーネント | 行 | visible 値 | 判定 |
|---|---|---|---|
| UnitSymbol | 184 | `isVisible={isInteriorVisible ? 1 : 0}` | ✅ |
| MapIconLabel | 194 | `isVisible={isInteriorVisible}` | ✅ |

両コンポーネントとも `isInteriorVisible` に依存したまま変更なし。  
zoom < 17.8（building モード）で非表示となる動作が維持されている。

---

### 3. 変更漏れチェック

MapScreen.tsx 内の全 `visible`/`isVisible` プロパティ（ErrorOverlay 含む9箇所）を網羅確認:

| 行 | コンポーネント | visible 値 | 変更漏れ？ |
|---|---|---|---|
| 96 | ErrorOverlay (fullscreen) | `visible={true}` | 別関心（エラー状態）・対象外 |
| 116 | ErrorOverlay (overlay) | `visible={true}` | 別関心・対象外 |
| 136 | VenueView | `visible={true}` | ❌ なし |
| 145 | Surface underlay | `visible={true}` | ❌ なし |
| 156 | Surface current | `visible={true}` | ❌ なし |
| 166 | StairsLayer | `visible={true}` | ❌ なし |
| 175 | FloorView | `visible={true}` | ❌ なし |
| 184 | UnitSymbol | `isVisible={isInteriorVisible ? 1 : 0}` | ❌ なし（維持） |
| 194 | MapIconLabel | `isVisible={isInteriorVisible}` | ❌ なし（維持） |

BuildingOutlineLayer は既存の別タスクで MapScreen からの参照が全削除済み。

**変更漏れなし ✅**

---

### 4. `isInteriorVisible` の残存参照

MapScreen.tsx 内の `isInteriorVisible` 参照は以下の3箇所のみ:

| 行 | 用途 |
|---|---|
| 105 | `const isInteriorVisible = displayMode !== "building";`（定義） |
| 184 | `isVisible={isInteriorVisible ? 1 : 0}`（UnitSymbol） |
| 194 | `isVisible={isInteriorVisible}`（MapIconLabel） |

`grep_search` で `mobile/src/features/home/map/` 全体を検索した結果も上記3箇所のみ。

**UnitSymbol/MapIconLabel のみの参照である ✅**

---

### 5. 型エラー

`get_errors(MapScreen.tsx)` の結果: **エラー 0 件**
`npx tsc --noEmit` は TST フェーズで確認予定。

**型エラーなし ✅**

---

### 6. `displayMode` 変数の残存

line 31: `const displayMode = useDisplayLevel(zoom);` — 定義あり。  
`isInteriorVisible` の計算に使用中。

**残存確認 ✅**

---

## 変更ファイル一覧

| ファイル | 変更内容 |
|---|---|
| `src/features/home/map/MapScreen.tsx` | VenueView / Surface(underlay/current) / StairsLayer / FloorView の `visible` を `true` に変更。UnitSymbol / MapIconLabel は `isInteriorVisible` のまま維持。 |

変更は `MapScreen.tsx` 1ファイルのみ。

---

## 総評

- 仕様（zoom < 17.8 でシンボルのみ非表示）を正しく実装
- 全5コンポーネントの `visible` が `true` に変更済み
- シンボル2コンポーネントの `isInteriorVisible` 依存は維持
- 変更漏れなし、型エラーなし
- 後方互換性: `visible={true}` は従来の `visible={isInteriorVisible}` 相当の動作を zoom 全域で保証
