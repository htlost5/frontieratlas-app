---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-20
status: draft
category: log
destination: docs/_inbox/
tags:
  - IMP
  - handoff
  - TASK-compass-001
---

# HANDOFF: IMP → REV

## status: success
## confidence: high

## Artifacts

| ファイル | 種別 | 説明 |
|----------|------|------|
| `src/config/remote.ts` | 新規 | R2 Worker Proxy エンドポイント定義 |
| `src/data/geojson/service/RemoteSyncService.ts` | 新規 | R2 リモート同期サービス |
| `src/data/geojson/index.ts` | 変更 | `checkAndUpdate()` に R2 同期呼び出し追加 |

## Verification

- `npx tsc --noEmit`: ✅ エラーなし
- `get_errors`: 3ファイルともエラーなし
- 既存コード未変更: `GeojsonRepository`, `AssetRestoreService`, `mapLayerCache`, `geojsonAssetMap.ts`

## レビュー観点（REV 確認項目）

1. **型の正しさ**: `SyncPlan`, `UpsertMeta`, `BuildManifest`, `LocalManifest` の型が正しいか
2. **既存コード非改変**: 仕様で「変更禁止」とされたファイルが変更されていないか
3. **エラーハンドリング**: `QuotaExceededError` が正しく伝播し、それ以外のエラーは catch されているか
4. **sha256 検証**: ダウンロード後の sha256 検証ロジックが正しいか
5. **delete 対象の絞り込み**: `source='remote'` のみ削除対象としているか
6. **ファイル独立実行**: 1ファイルの失敗が他に影響しない構造になっているか

## routing: REV

CRITICAL 指摘発生時のみ ORC にエスカレーション。
