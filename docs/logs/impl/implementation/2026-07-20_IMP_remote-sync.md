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

# Implementation Log: R2 Remote Data Sync

## Summary

R2 Worker Proxy からのリモート GeoJSON データ同期機能を実装した。

## Changes

### 1. New: `src/config/remote.ts`

R2 Worker Proxy のベース URL と各エンドポイント定数を定義。

- `REMOTE_BASE_URL`: `https://geo-data-push.htlost8.workers.dev/data`
- `VERSION_URL`, `MANIFEST_URL`: 各エンドポイント URL
- `geojsonUrl(relativePath)`: relativePath から完全な GeoJSON URL を組み立てるヘルパー

### 2. New: `src/data/geojson/service/RemoteSyncService.ts`

リモート同期サービス。以下の公開メソッドを持つ:

- `checkForUpdates()`: version.json を取得しローカルバージョンと比較。ネットワークエラー時は false を返す
- `planSync(remoteManifest)`: リモート/ローカルマニフェストを sha256 で比較し `SyncPlan` (add/update/delete) を生成
- `executeSync(plan, version, remoteManifest)`: add/update 対象をダウンロード→sha256 検証→upsert。delete 対象を削除。各ファイル独立実行
- `syncIfNeeded()`: checkForUpdates→planSync→executeSync→cleanupOrphans を一括実行。エラーは catch して throw しない

依存:
- `fetchJsonWithRetry<T>`, `fetchTextWithRetry` from `@/src/infra/network/fetchJson`
- `GeojsonRepository` (getInstance, upsert, upsertMany, delete, getLocalManifest, setLocalManifest, recordFailure, cleanupOrphans, getSource)
- `sha256` from `@/src/infra/sha256/hashCheck`
- `parseJson`, `stringifyJson` from `@/src/infra/jsonParse/jsonParser`
- `BuildManifest`, `LocalManifest` from `@/src/domain/manifestTypes`
- `QuotaExceededError`, `NetworkError` from `@/src/domain/NetworkErrors`

`upsertMany` ではなく `upsert` を逐次実行している（1ファイルの失敗が他に影響しないよう、トランザクション外で独立実行）。

### 3. Modified: `src/data/geojson/index.ts`

`checkAndUpdate()` 関数に R2 同期呼び出しを追加。既存のバンドルアセットリストアロジックを `if/else` に変更し、その後に `RemoteSyncService.syncIfNeeded()` を常時実行するようにした。

- アセットリストア要否に関わらず R2 同期を実行
- クォータ超過時は特別扱い
- その他のエラーはキャッチしてログ出力（起動をブロックしない）

## Verification

- `npx tsc --noEmit`: ✅ エラーなし
- `get_errors`: 3ファイルともエラーなし
- 既存コードの変更: `src/data/geojson/index.ts` のみ修正。`GeojsonRepository`, `AssetRestoreService` 等は未変更

## Constraints Adherence

- ✅ 既存の `GeojsonRepository` / `AssetRestoreService` / `mapLayerCache` / `geojsonAssetMap.ts` を変更しない
- ✅ 新しい npm パッケージは追加しない
- ✅ ネットワーク未接続時もエラーを throw しない（catch してログ出力）
- ✅ `checkAndUpdate()` は非同期実行で起動をブロックしない
