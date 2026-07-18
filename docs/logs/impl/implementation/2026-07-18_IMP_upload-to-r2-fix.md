---
agent: IMP
task_id: TASK-compass-001
date: 2026-07-18
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

# Implementation Log: upload-to-r2.mjs — wrangler→REST API 移行

## 修正内容

### 背景
`tools/map-assets/scripts/upload-to-r2.mjs` の `cleanupOldReleases()` が `wrangler r2 object list` を使用していたが、wrangler 4.x でこのサブコマンドが削除されている。ランタイムエラー必至のため修正。

### 変更点

| # | 変更 | 詳細 |
|---|------|------|
| 1 | `listR2Objects()` 新規追加 | Cloudflare REST API で R2 オブジェクト一覧を取得する非同期関数 |
| 2 | `deleteR2Object()` 新規追加 | Cloudflare REST API で R2 オブジェクトを削除する非同期関数 |
| 3 | `cleanupOldReleases()` 書き換え | wrangler CLI (`execSync`) → `listR2Objects()` + `deleteR2Object()` (fetch) |
| 4 | `main()` → `async function main()` | fetch 非同期呼び出しに対応 |
| 5 | `main()` 呼び出し | `main()` → `main().catch(...)` パターンに変更 |
| 6 | フロー順序変更 | cleanup → upload から upload → cleanup に変更。アップロード失敗時は cleanup をスキップし exit code 1 で終了 |
| 7 | ヘルパー追加 | `statSync` import を追加（`walkDir` 内で使用） |

### 設計判断
- `wrangler r2 object put` は wrangler 4.x でも利用可能なためそのまま維持
- Cloudflare API 認証には `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN` 環境変数を利用（事前設定必須）
- アップロード失敗時は cleanup をスキップしデータ消失を防止
- エラーハンドリングは各 API 呼び出し単位で try-catch し、重要でないエラーは warn 出力で継続

### 構文チェック
- `node --check map-assets/scripts/upload-to-r2.mjs` — ✅ OK

### 成果物
- 修正ファイル: `tools/map-assets/scripts/upload-to-r2.mjs`
