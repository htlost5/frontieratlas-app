---
agent: IMP
task_id: TASK-release-logic-001
date: 2026-07-20
status: draft
category: log
destination: docs/logs/impl/implementation/
tags:
  - IMP
  - implementation
  - TASK-release-logic-001
---

# Implementation Log: tools/map-assets リリースロジック

## Overview

`tools/map-assets` のリリースロジックを整備。統合リリーススクリプトの新規作成、既存スクリプトのモジュール化、CI/CD ワークフローの修正、README の日本語化を実施。

## Changes

| # | File | Action | Description |
|---|------|--------|-------------|
| 1 | `scripts/release.mjs` | **CREATE** | 統合ローカルリリーススクリプト。1コマンドで transform → build → update-latest を実行 |
| 2 | `builder/build-release.js` | **MODIFY** | `main()` → `buildRelease(version)` にリファクタリング。`module.exports` 追加で他スクリプトから呼び出し可能に。CLI互換性維持 |
| 3 | `package.json` | **MODIFY** | `"release"` スクリプト追加 |
| 4 | `.github/workflows/release.yml` | **MODIFY** | meta/latest.json 関連ステップ削除。`git add releases meta` → `git add releases` に変更 |
| 5 | `.github/workflows/upload-r2.yml` | **CREATE** | R2 アップロード用 workflow_dispatch ワークフロー |
| 6 | `.github/workflows/updateLatest.yml` | **MODIFY** | meta/latest.json 関連ステップ削除。releases/latest.json に変更 |
| 7 | `.gitignore` | **MODIFY** | `meta/latest.json` 追加 |
| 8 | `README.md` | **MODIFY** | 完全書き換え（日本語） |

## Implementation Details

### 1. `scripts/release.mjs`
- ESM 形式の統合リリーススクリプト
- `execSync` で3ステップを逐次実行
- バージョンフォーマット検証 (`vX.Y.Z`)
- タイムアウト5分設定

### 2. `builder/build-release.js`
- グローバル定数宣言（SRC_DIR, RELEASE_ROOT 等）を削除し `buildRelease()` 内のローカル変数に移動
- `buildRelease(version)` としてエクスポート可能に
- `require.main === module` でCLI互換性維持
- `module.exports = { buildRelease, copyRecursive, createZip }` で他スクリプトからの利用を可能に

### 3. CI/CD ワークフロー修正
- **release.yml**: meta/latest.json の gh-pages へのコピーを削除。代わりに releases/latest.json を gh-pages/ 配下に配置
- **updateLatest.yml**: 同様に meta/latest.json → releases/latest.json に変更
- **upload-r2.yml**: 新規作成。workflow_dispatch で手動トリガー

### 4. README.md
- 日本語に全面書き換え
- ディレクトリ構成、リリース方法（ローカル/Git CI/R2）、各スクリプト個別実行、CI/CD ワークフロー一覧を記載

## Verification

- [x] `build-release.js` の export が正しい（`buildRelease`, `copyRecursive`, `createZip`）
- [x] `release.yml` の latest.json 関連のパス修正完了
- [x] `updateLatest.yml` の latest.json 関連のパス修正完了
- [x] `.gitignore` に `meta/latest.json` 追加完了

## Open Questions

なし
