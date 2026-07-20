---
agent: TST
task_id: TASK-building-outline-datasource
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/testing/
related:
  - "[TASK-building-outline-datasource]"
tags:
  - TST
  - testing
  - MapScreen
  - buildingOutline
---

# Testing Log: BuildingOutline データソース切替

## テスト実行日

2026-07-20

## テスト対象ファイル

- `mobile/src/features/home/map/MapScreen.tsx`

## 変更概要

`buildingOutlineData` のデータソースをキャッシュ(getMapCache)の3F surface から
`geoJsonMap["studyhall_surface"].content` に切り替え。`sanitizeFeatureCollection` を適用。

## テスト結果

| # | テスト項目 | 結果 | 備考 |
|---|-----------|------|------|
| 1 | `npx tsc --noEmit` | ✅ PASS | コンパイルエラーなし |
| 2 | `npx expo lint` | ✅ PASS | Lintエラーなし |
| 3 | VSCode get_errors | ✅ PASS | エラーなし |
| 4 | 静的解析（描画ロジック） | ✅ PASS | 問題なし |

## 静的解析詳細（#4）

### buildingOutlineData の生成

```tsx
const buildingOutlineData = useMemo(() => {
  try {
    const data = geoJsonMap["studyhall_surface"].content;
    return sanitizeFeatureCollection(data);
  } catch {
    return null;
  }
}, []);
```

- `geoJsonMap["studyhall_surface"]` の型: `GeoJsonAssetEntry<FeatureCollection>` → `.content` は `FeatureCollection`
- `sanitizeFeatureCollection(fc: FeatureCollection): FeatureCollection` → 型一致 ✅
- `useMemo` の依存配列が `[]`（マウント時1回計算）— 静的データなので妥当 ✅
- `try-catch` で null 安全 — データ不存在時は `null` 返却 ✅

### BuildingOutlineLayer のレンダリング

```tsx
{buildingOutlineData && (
  <BuildingOutlineLayer
    data={buildingOutlineData}
    visible={showBuildings}
    colorTheme={colorTheme}
  />
)}
```

- `BuildingOutlineLayer` の Props 型: `{ data: FeatureCollection | null; visible: boolean; colorTheme: ColorTheme }`
- `buildingOutlineData` は条件ガード済み → `FeatureCollection` として渡る ✅
- `showBuildings` = `displayMode === "building"` — building モードのみ表示 ✅
- レイヤー順序 #8（最前面）— コメントと実装が一致 ✅
- `colorTheme` は `useMapContext()` から取得 → `PolygonLayer` へ伝播 ✅

## 総合判定

**✅ 合格** — 全4項目 PASS

変更は最小限（4行: import 2行 + useMemo 内部 5行）で、型安全性・null安全性・レンダリングロジックすべて問題なし。
