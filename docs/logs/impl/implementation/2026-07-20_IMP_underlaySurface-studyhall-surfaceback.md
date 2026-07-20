---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-20
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - IMP
  - implementation
  - TASK-compass-001
---

# Implementation Log: underlaySurface に studyhall_surfaceback を設定

## 変更概要

1F 以外の全フロア(2F-5F) の underlaySurface を studyhall_surfaceback に変更。

## 変更ファイル

### 1. `src/features/home/map/hooks/dataLoad/mapLayerCache.ts`

- `ALL_MAP_IDS` 配列に `"studyhall_surfaceback"` を追加
- 2F/3F の underlaySurface を 1F surface で設定する既存コードブロックを削除
- 4F/5F の underlaySurface を 3F surface で設定する既存コードブロックを削除
- 代わりに `resolveFeatureCollection` で `studyhall_surfaceback` をロードし、2F〜5F の全フロアの `underlaySurface` に設定

### 2. `src/features/home/map/MapScreen.tsx`

- コメント `{/* 2. Surface underlay (4F/5F の 3F surface, opacity 0.5) */}` → `{/* 2. Surface underlay (1F以外: studyhall_surfaceback, opacity 0.5) */}`

## 検証結果

- `get_errors` ツールで両ファイルのコンパイルエラーなしを確認 ✅
- `geojsonAssetMap.ts` に `studyhall_surfaceback` が既に定義されていることを確認済み ✅

## 実装ログ

| 項目 | 値 |
|------|-----|
| 日時 | 2026-07-20 14:00 JST |
| 実装者 | IMP |
| 変更ファイル数 | 2 |
| エラー | なし |
