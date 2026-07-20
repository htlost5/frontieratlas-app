---
agent: TST
task_id: TASK-version-json-001
date: 2026-07-19
status: approved
category: log
destination: docs/logs/impl/testing/
related:
  - "[TASK-version-json-001](../shared/tasks/active/TASK-version-json-001_version-json-removal.md)"
tags:
  - TST
  - testing
  - TASK-version-json-001
---

# Testing Log: version.json removal + data/ only upload + mobile cleanup

## Result

**判定: ✅ 合格**

全テスト項目が合格。不合格項目なし。

---

## テスト項目詳細

### 1. 静的チェック

| 項目 | 結果 | 詳細 |
|------|------|------|
| `node --check map-assets/scripts/upload-to-r2.mjs` | ✅ 合格 | 構文エラーなし（tools/ で実行） |
| `npx tsc --noEmit` (mobile/) | ✅ 合格 | 型エラー 0 |
| `npx expo lint` (mobile/) | ✅ 合格 | 0 errors, 5 warnings（全て既存、本変更由来なし） |

### 2. コードレビュー観点検証（upload-to-r2.mjs）

| 観点 | 結果 | 確認方法 |
|------|------|----------|
| R2 key 構築: バージョンプレフィックス `${version}/` | ✅ 合格 | コード内に存在 |
| R2 key 構築: `walkDir(dataDir)` で data/ 内のみ走査 | ✅ 合格 | コード内に存在 |
| R2 key 構築: `toPosixRelative` で data/ スキップ | ✅ 合格 | コード内に存在 |
| data/ 不在時の `existsSync` + `process.exit(1)` | ✅ 合格 | コード内に存在 |
| version.json 個別アップロードブロック削除 | ✅ 合格 | version.json はコメント内参照のみ。walkDir で data/ 全体を自動カバー |
| zip ファイル除外 | ✅ 合格 | walk 対象は `dataDir`（= releases/v1.1.0/data/）。zip は releases/v1.1.0/ 直下 → 対象外 |

### 3. mobile クリーンアップ確認

| 項目 | 結果 |
|------|------|
| `VersionInfo` 参照 (mobile/src/**) | ✅ 0件 — 完全除去 |
| `types/index.ts` の VersionInfo 型 | ✅ 削除完了 |
| `index.ts` の VersionInfo/version.json 参照 | ✅ 削除完了 |

### 4. 既存テスト実行

| 項目 | 結果 |
|------|------|
| 既存テストファイルの有無 | 該当なし（プロジェクトにテストファイルなし） |

---

## 総評

全 4 カテゴリ（静的チェック / コード検証 / mobile クリーンアップ / 既存テスト）の全項目が合格。
不合格項目はゼロ。HANDOFF 可能。
