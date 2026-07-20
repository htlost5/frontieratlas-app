---
agent: REV
task_id: TASK-version-json-001
date: 2026-07-19
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-version-json-001](../shared/tasks/active/TASK-version-json-001_version-json-removal.md)"
tags:
  - REV
  - review
  - TASK-version-json-001
---

# Review Log: version.json removal + data/ only upload + mobile cleanup

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。全6レビューポイントをクリア。

- セキュリティ脆弱性: なし
- 仕様不適合: なし
- Lint エラー: 0（既存 warning のみ）
- 型エラー: 0（`npx tsc --noEmit` passed）

## Reviewed Files

1. `tools/map-assets/scripts/upload-to-r2.mjs` (upload-to-r2.mjs)
2. `mobile/src/data/geojson/types/index.ts` (types)
3. `mobile/src/data/geojson/index.ts` (geojson entry)

## Review Points Detail

### 1. R2 key 構築ロジック

```
dataDir -> toPosixRelative(filePath, dataDir) -> $version/$relPath
```
- Worker R2 Proxy の key 抽出 `/data/(.+)` と完全一致
- バージョン前置 + data/ スキップの設計が正しい

### 2. zip ファイル誤アップロード防止

- `walkDir(dataDir)` で data/ 内のみ走査
- zip は `releases/v1.1.0/imdf-v1.1.0.zip`（data/ 外）→ 対象外

### 3. version.json トップレベル個別アップロード削除

- 旧コードの個別アップロード処理は完全に除去済み
- version.json は data/ 内のファイルとして自動的にアップロード

### 4. data/ 不在時エラーハンドリング

- `existsSync` チェック + `process.exit(1)` + 明確なエラーメッセージ

### 5. VersionInfo 参照漏れ（mobile）

- `mobile/src/**` 内で `VersionInfo` 参照: **0件** ✅
- `version.json`, `fetchLatestVersion` の残存参照: **0件** ✅
- `types/index.ts`: VersionInfo 型完全削除 ✅
- `index.ts`: VersionInfo 参照完全削除 ✅

### 6. Worker への影響評価（worker-push/index.js）

- Worker 側の変更不要
- R2 key 形式 `v1.1.0/imdf/xxx.json` で整合
- ルーター・認証・クォータ制限への影響なし

### Lint / TypeScript

- `npx expo lint`: 0 errors, 5 warnings（全て既存、本変更由来なし）
- `npx tsc --noEmit`: 型エラー 0

## Handoff to TST

確認項目:
- [ ] `npx tsc --noEmit` が通ること
- [ ] 既存テストが存在すれば実行しパスすること
- [ ] tools 側のスクリプトが dry-run 可能なら動作確認
