---
agent: IMP
task_id: TASK-split-repos
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-split-repos](../shared/tasks/active/TASK-split-repos.md)"
tags:
  - IMP
  - implementation
  - TASK-split-repos
---

# Implementation Log: Split-Repo CRITICAL 修正

## 対応内容

### CRITICAL 1: release-geo-data.yml のパス修正

- 元ファイル: `frontieratlas/.github/workflows/release-geo-data.yml`
- 移動先: `frontieratlas/tools/.github/workflows/release.yml`
- ファイル内容は同一（`map-assets/` プレフィックスは tools リポジトリ内で正しいため変更不要）
- 移動元の `frontieratlas/.github/` ディレクトリを削除

### 軽微修正 2: generate_geojsonAssetMap.js の usage コメント

- ファイル: `mobile/scripts/generate_geojsonAssetMap.js`
- 旧: `node ./tools/generate-geojson-registry.js`
- 新: `node ./scripts/generate_geojsonAssetMap.js`

### 軽微修正 3: upload-to-r2.mjs の usage コメント

- ファイル: `tools/map-assets/scripts/upload-to-r2.mjs`
- 旧: `node tools/scripts/upload-to-r2.mjs`
- 新: `node map-assets/scripts/upload-to-r2.mjs`

## 確認

- ルート `.github/` 削除後、他の `.github/` ワークフローファイルは存在しないため問題なし
- コメント修正のみでコードロジックへの影響なし
