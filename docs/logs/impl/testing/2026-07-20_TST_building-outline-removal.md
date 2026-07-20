---
agent: TST
task_id: TASK-buildingOutline-001
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/testing/
related:
  - "[TASK-buildingOutline-001]"
  - "[REV review log](../review/2026-07-20_REV_building-outline-removal.md)"
tags:
  - TST
  - testing
  - TASK-buildingOutline-001
---

# Test Log: BuildingOutlineLayer Removal

## Test Result

**判定: ✅ 合格**

全テスト項目パス。型エラーなし、Lint エラーなし、コード残存確認完了。

---

## 1. 型チェック — `npx tsc --noEmit`

| 項目 | 結果 |
|------|------|
| コマンド結果 | 出力なし = エラー 0 |
| VSCode get_errors(MapScreen.tsx) | エラー 0 件 |

**✅ 合格**

---

## 2. Lint チェック — `npx expo lint`

| 項目 | 結果 |
|------|------|
| コマンド結果 | 出力なし = エラー 0 |

**✅ 合格**

---

## 3. 既存テスト実行

`package.json` に `"test"` スクリプトが定義されていないためスキップ。

**⚠️ 該当なし**

---

## 4. コード静的検証

### 4.1 MapScreen.tsx 内の残存確認

| キーワード | grep 結果 | 判定 |
|-----------|-----------|------|
| `BuildingOutlineLayer` | 0 件（MapScreen 内） | ✅ |
| `studyhall_surface` | コメント内の `studyhall_surfaceback` のみ（surface underlay 説明、BuildingOutlineLayer と無関係） | ✅ |
| `buildingOutlineData` | 0 件 | ✅ |
| `showBuildings` | 0 件 | ✅ |
| `geoJsonMap` (import) | 0 件 | ✅ |
| `sanitizeFeatureCollection` (import) | 0 件 | ✅ |

### 4.2 displayMode / isInteriorVisible 維持確認

`displayMode` → line 31: `const displayMode = useDisplayLevel(zoom);` ✅
`isInteriorVisible` → line 105: `const isInteriorVisible = displayMode !== "building";` ✅
全 visible / isVisible 参照に使用中（7箇所） ✅

---

## 5. 他ファイルへの影響確認

| ファイル | 状態 | 判定 |
|----------|------|------|
| `layers/buildingOutline/index.tsx` | コンポーネント定義として残存。MapScreen からの参照なし | ✅ 問題なし |

---

## 総評

- Expo プロジェクトの必須チェック（lint + tsc）をクリア
- 削除対象のキーワードが MapScreen.tsx に一切残存していないことを確認
- 削除すべきでない `displayMode` / `isInteriorVisible` の維持を確認
- 本変更によるコンパイルエラー・Lint エラーはゼロ

**本テストは合格と判定する。**
