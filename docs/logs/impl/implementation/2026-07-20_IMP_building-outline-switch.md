---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[MapScreen.tsx](../../../../src/features/home/map/MapScreen.tsx)"
  - "[geoJsonAssetMap](../../../../src/data/geojson/geojsonAssetMap.ts)"
  - "[sanitizeGeoJSON](../../../../src/infra/geojson/sanitizeGeoJSON.ts)"
tags:
  - IMP
  - implementation
  - TASK-compass-001
---

# Implementation Log: Building Outline — Switch from Cache 3F Surface to studyhall_surface

## Summary

`MapScreen.tsx` の building モード表示用データソースを、キャッシュの 3F surface データから `geoJsonMap["studyhall_surface"]`（全フロア統合サーフェス）に切り替えた。

## Changes

### File: `src/features/home/map/MapScreen.tsx`

| # | 変更内容 |
|---|---------|
| 1 | `getMapCache` のインポートを削除（未使用になったため） |
| 2 | `geoJsonMap` のインポートを追加 |
| 3 | `sanitizeFeatureCollection` のインポートを追加 |
| 4 | `buildingOutlineData` の useMemo 実装を差し替え |

### Before (old implementation)

```ts
const buildingOutlineData = useMemo(() => {
    const cache = getMapCache();
    return cache?.floors.get(3)?.surface ?? null;
}, []);
```

### After (new implementation)

```ts
const buildingOutlineData = useMemo(() => {
    try {
      const data = geoJsonMap["studyhall_surface"].content;
      return sanitizeFeatureCollection(data);
    } catch {
      return null;
    }
}, []);
```

## Verification

- ✅ VSCode `get_errors` → No errors found
- ✅ `npx tsc --noEmit` → Exit 0, no output

## Notes

- `getMapCache` の定義自体は他ファイル（`useBatchMapData.ts` 等）で使用されているため、インポート行のみ削除し関数定義は維持
- `sanitizeFeatureCollection` を適用することで、earcut 三角分割クラッシュの防止を継承
- 空のキャッシュ時にも fallback が効くよう `try/catch` で保護
