---
agent: TST
task_id: TASK-venueVisible-001
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/testing/
related:
  - "[REV Review Log](../review/2026-07-20_REV_venueVisible-global-toggle.md)"
tags:
  - TST
  - testing
  - TASK-venueVisible-001
---

# Testing Log: venueVisible グローバルトグル

## 総合結果

**判定: ✅ 合格**

---

## テスト項目一覧

### 1. 型チェック（VSCode get_errors）
| ファイル | 結果 |
|----------|------|
| `src/features/home/map/context/MapContext.ts` | ✅ エラー0件 |
| `src/features/home/map/MapRoot.tsx` | ✅ エラー0件 |
| `src/features/home/map/MapScreen.tsx` | ✅ エラー0件 |

### 2. 型チェック（npx tsc --noEmit）
- **結果**: ✅ 合格
- 出力なし（正常終了、exit code 0）

### 3. Lint（npx expo lint）
- **結果**: ✅ 合格
- 出力なし（正常終了、exit code 0）

### 4. 静的検証 — venueVisible 出現箇所

#### MapContext.ts
| 行 | コード | 判定 |
|---|--------|------|
| 29 | `venueVisible: boolean;` | ✅ |
| 30 | `setVenueVisible: (v: boolean) => void;` | ✅ |

#### MapRoot.tsx
| 行 | コード | 判定 |
|---|--------|------|
| 26 | `const [venueVisible, setVenueVisible] = useState(true);` | ✅ デフォルトtrue |
| 96 | `venueVisible,` | ✅ context value に設定 |
| 97 | `setVenueVisible,` | ✅ context value に設定 |

#### MapScreen.tsx
| 行 | コード | 判定 |
|---|--------|------|
| 30 | `const { floor, zoom, setZoom, colorTheme, iconsVisible, venueVisible } =` | ✅ 分割代入 |
| 140 | `visible={venueVisible}` | ✅ `visible={true}` から置換完了 |

### 5. 既存テスト
- **結果**: ✅ 該当なし
- `src/` 配下に `.test.*` / `.spec.*` ファイルなし
- `package.json` にテストランナーの設定なし

---

## 静的検証サマリ

- `venueVisible` の出現は3ファイルのみ。影響範囲は限定されている
- VenueView 以外の全レイヤー（Surface / Stairs / FloorView / UnitSymbol / MapIconLabel）は `visible={true}` 維持 — 変更漏れなし
- `useState(true)` により既存動作との互換性維持

---

## テスト環境

- TypeScript: npx tsc --noEmit v5.x
- Linter: npx expo lint
- 静的検証: VSCode get_errors + grep_search
- プラットフォーム: Expo (managed workflow)
