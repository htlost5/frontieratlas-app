---
agent: IMP
task_id: TASK-GEO-SOURCE-CONFIG
date: 2026-07-20
status: pending
category: shared
destination: shared/impl/specs/interfaces/
related: []
tags:
  - IMP
  - handoff
  - REV
  - TASK-GEO-SOURCE-CONFIG
---

# HANDOFF: IMP → REV — データ取得元を config で local/remote 切り替え

## status: 成功

## confidence: high

## 変更内容

### 1. `mobile/config/geo-data-version.json`
- `source: "local"` フィールドを追加

### 2. `mobile/src/data/geojson/index.ts`
- `geoDataConfig` を import
- `checkAndUpdate()` 内の R2 同期を条件分岐化（`source === "remote"` 時のみ実行）

## 型チェック
- `npx tsc --noEmit` ✅ エラーなし

## 成果物
- `mobile/config/geo-data-version.json`
- `mobile/src/data/geojson/index.ts`
- `mobile/docs/logs/impl/implementation/2026-07-20_IMP_geo-data-source-config.md`

## open_questions
なし

## routing
次工程: **REV** → TST
CRITICAL 指摘時のみ ORC にエスカレーション。
