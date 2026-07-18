---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-18
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[useBatchMapData](../../../../src/features/home/map/hooks/dataLoad/useBatchMapData.ts)"
tags:
  - IMP
  - implementation
  - TASK-compass-001
---

# Implementation Log: NativeDatabase 同時 prepareAsync クラッシュ修正

## 概要

Android expo-sqlite の `NativeDatabase` 共有オブジェクト競合により、`Promise.all` で同時実行した `getGeoDataByLogicalId()` がクラッシュを引き起こす問題を修正。

## 修正内容

### ファイル
`mobile/src/features/home/map/hooks/dataLoad/useBatchMapData.ts`

### 修正点

| # | 箇所 | 修正前 | 修正後 |
|---|------|--------|--------|
| 1 | import | `getGeoDataByLogicalId` を import | 削除（他で未使用のため） |
| 2 | 初回 venue 読み込み (~198行目) | `Promise.all([getGeoDataByLogicalId(...) ×4])` | `repo.getMany(venueIds)` でバッチ取得 + アセットフォールバック |
| 3 | フロアデータ読み込み (~224行目) | `Promise.all([getGeoDataByLogicalId(...) ×2])` | `repo.getMany(floorIds)` でバッチ取得 + アセットフォールバック |

### パターン
既存の `preloadAllFloors()` で使用済みの `GeojsonRepository.getInstance().getMany()` バッチ取得パターンに統一。`Promise.all` による同時ネイティブ呼び出しを排除し、1回の `getMany()` で複数 ID を取得する。

## 検証

- `npx tsc --noEmit` → 終了コード 0（型エラーなし）
- 未使用 import の削除確認
- `preloadAllFloors()` とのパターン統一確認
