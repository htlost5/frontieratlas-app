---
agent: REV
task_id: TASK-buildingOutline-001
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-buildingOutline-001]"
tags:
  - REV
  - review
  - buildingOutline
---

# Review Log: BuildingOutlineLayer Removal

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。BuildingOutlineLayer の削除は完全かつ安全に実施されている。

---

## Review Items

### 1. BuildingOutlineLayer の完全削除 ✅

| 項目 | 結果 |
|------|------|
| import 文 | 残存なし（grep 確認） |
| JSX レンダリング | 残存なし（grep 確認） |
| useMemo (processedBuildingGeoJson) | 残存なし（grep 確認） |
| showBuildings 変数/条件 | 残存なし（grep 確認） |

### 2. geoJsonMap / sanitizeFeatureCollection の import ✅

MapScreen.tsx 内にこれらの import は一切存在しない。完全削除確認。

### 3. displayMode / isInteriorVisible の動作 ✅

- `const displayMode = useDisplayLevel(zoom);` — 維持 ✅
- `const isInteriorVisible = displayMode !== "building";` — 維持 ✅
- building モード時のレンダリング制御に影響なし

### 4. useMemo import の使用継続 ✅

- 削除前: `BuildingOutlineLayer` 用 + `processedUnitGeoJson` 用の 2 箇所
- 削除後: `processedUnitGeoJson`（line 56）で引き続き使用中
- import 文 `import ... useMemo ...` は有効

### 5. レイヤ順序コメント ✅

lines 117-127 のコメントは BuildingOutlineLayer に言及しておらず、
現行の7レイヤ（Venue → Surface underlay → Surface current → Stairs → FloorView → UnitSymbol → MapIconLabel）と完全一致。

### 6. 型エラー ✅

VSCode get_errors でエラー 0 件を確認。

### 7. 他ファイルへの影響確認 ✅

| ファイル | 状態 |
|----------|------|
| `layers/buildingOutline/index.tsx` | 既存コードとして残存（MapScreen からの参照なし） |
| `useBatchMapData` / batchData | `studyhall_surface` データを返却し続ける可能性あり — ただし MapScreen では参照しないため影響なし |
| その他全ファイル | BuildingOutlineLayer 参照なし |

---

## 変更ファイル一覧

| ファイル | 変更内容 |
|----------|----------|
| `src/features/home/map/MapScreen.tsx` | BuildingOutlineLayer 関連の import / useMemo / JSX / showBuildings を削除 |

---

## TST 確認項目

- [ ] `npx tsc --noEmit` が通ること（REV 確認済みだが念のため）
- [ ] 既存テストが存在すれば実行しパスすること
- [ ] building モード（zoom < 17.8）で BuildingOutlineLayer が表示されない視認確認
- [ ] non-building モード（zoom ≥ 17.8）で他の全レイヤが正常表示される視認確認
