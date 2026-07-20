---
agent: IMP
task_id: TASK-GEO-SOURCE-CONFIG
date: 2026-07-20
status: draft
category: log
destination: logs/impl/implementation/
related:
  - "[TASK-GEO-SOURCE-CONFIG](../shared/tasks/active/TASK-GEO-SOURCE-CONFIG_geo-data-source-config.md)"
tags:
  - IMP
  - implementation
  - geo-data
  - config
  - R2-sync
---

# 実装ログ: データ取得元を config で local/remote 切り替え

## 変更内容

### 1. `config/geo-data-version.json`
- `source` フィールドを追加（型: `"local" | "remote"`、デフォルト: `"local"`）
- 値は `"local"` に設定

### 2. `src/data/geojson/index.ts`
- `geoDataConfig` を import
- `checkAndUpdate()` 内の R2 リモート同期呼び出しを条件分岐に変更:
  - `source === "remote"` → 従来通り `RemoteSyncService.syncIfNeeded()` を実行（QuotaExceededError のハンドリング含む）
  - `source === "local"` → スキップログを出力
- 型アサーション `(geoDataConfig as { version: string; source?: string })` で `source` に型安全性を付与

## 自己チェック
- [x] `npx tsc --noEmit` — エラーなし
- [x] `source: "remote"` のとき既存動作を維持
- [x] `source: "local"`（デフォルト）で R2 同期をスキップ

## 成果物
- `mobile/config/geo-data-version.json` — 変更
- `mobile/src/data/geojson/index.ts` — 変更
