---
agent: REV
task_id: TASK-compass-002
date: 2026-07-18
status: approved
category: shared
destination: shared/impl/
related:
  - "[TASK-compass-002](../shared/tasks/active/TASK-compass-002_map-layer-restructure.md)"
  - "[REV Review Log](../logs/impl/review/2026-07-18_REV_map-layer-restructure.md)"
tags:
  - REV
  - handoff
  - TASK-compass-002
---

# HANDOFF: REV → TST — マップレイヤ構造再設計

## Status
- **判定**: ✅ 承認 (approved)
- **確信度**: high

## レビュー成果物
1. レビューログ: `docs/logs/impl/review/2026-07-18_REV_map-layer-restructure.md`

## レビュー対象ファイル
| 種別 | ファイル |
|------|----------|
| 新規 | `src/features/home/map/hooks/dataLoad/mapLayerCache.ts` |
| 新規 | `src/features/home/map/layers/buildingOutline/index.tsx` |
| 改修 | `src/features/home/map/hooks/dataLoad/useBatchMapData.ts` |
| 改修 | `src/features/home/map/MapScreen.tsx` |
| 改修 | `src/features/home/map/layers/floor/surface/index.tsx` |
| 改修 | `src/features/home/map/layers/floor/index.tsx` |
| 削除 | `src/features/home/map/layers/buildings/` ディレクトリ全体 |

## CRITICAL 指摘
なし。全9項目の受入条件を満たしている。

## TST 確認項目
- [ ] `npx tsc --noEmit` が通ること
- [ ] `npx expo lint` が通ること
- [ ] 既存テストが存在すれば実行しパスすること
- [ ] レイヤ順序のビジュアル確認可能なこと (venue → surface → stairs → rooms → symbol)
- [ ] 4F/5F で 3F_surface が半透明で表示されること
- [ ] zoom < 17.8 で BuildingOutline が表示されること
- [ ] フロア切替時に FullScreenLoading が再表示されないこと

## ルーティング
- CRITICAL 指摘発生時のみ ORC にエスカレーション
- 合格時: ORC → (askQuestions 承認) → REL
