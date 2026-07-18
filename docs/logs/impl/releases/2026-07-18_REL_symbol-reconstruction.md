---
agent: REL
task_id: TASK-symbol-001
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/releases/
related: []
tags:
  - REL
  - release
  - commit-only
---

# Release — シンボル表示4分類再構築 (commit only, no tag)

## リポジトリ: mobile (frontieratlas-app)

| 項目 | 値 |
|---|---|
| コミットハッシュ | `39bd6b7` |
| ブランチ | `main` |
| タグ | なし |
| バージョン | 0.17.1 (変更なし) |
| コミットメッセージ | feat: シンボル表示4分類再構築 — 17カテゴリアイコン+12POI特殊シンボルに拡張 |

## リポジトリ: tools (frontieratlas-geo-tools)

| 項目 | 値 |
|---|---|
| コミットハッシュ | `c47c556` |
| ブランチ | `main` |
| タグ | なし |
| コミットメッセージ | fix: アイコン生成スクリプトのTABLER_ICONS_DIRパス解決を修正 |

## 変更概要

### 1. シンボル表示4分類再構築
- 部屋カテゴリ表示を 8→4モード (Type 1: 円形アイコン+文字 / Type 2: 特殊シンボル / Type 3: 文字のみ / Type 4: 非表示) に再編
- RoomCategory 型拡張: 8→18、ColorGroup 11色中間層導入
- POI 設定分離: `poiConfigs.ts` 新規作成、動的 expression 生成
- アイコン拡充: 7→17カテゴリアイコン + 7→11特殊シンボル
- 46ファイル変更 (713 insertions, 493 deletions)

### 2. パスバグ修正 (tools)
- `convert-tabler-icons.ts` / `convert-special-symbols.ts` の TABLER_ICONS_DIR パス解決修正
- 4ファイル変更 (72 insertions, 19 deletions)

## 検証ステータス

| チェック | 結果 |
|---|---|
| バージョンバンプ | スキップ |
| タグ付け | スキップ |
| git push (mobile) | ✅ 成功 |
| git push (tools) | ✅ 成功 |
