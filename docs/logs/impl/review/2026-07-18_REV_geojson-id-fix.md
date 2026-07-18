---
agent: REV
task_id: TASK-compass-001
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-compass-001](../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - REV
  - review
  - geojson-id-fix
---

# Review Log: GeoJSON Registry ID Mismatch Fix

## Review Result

**判定: ✅ 承認** — CRITICAL 指摘なし。コードは正しく修正されている。

---

## レビュー観点別評価

### 1. ID置換の正しさ（geojsonAssetMap.ts との一致確認）

| # | 対象 | Before | After | geoJsonMap キー存在 |
|---|------|--------|-------|-------------------|
| 1 | `MAP_LOGICAL_IDS.studyhall` | `"studyhall_footprint"` | `"studyhall_surface"` | ✅ L72-77 |
| 2 | `MAP_LOGICAL_IDS.interact` | `"interact_footprint"` | `"interact_surface"` | ✅ L63-67 |
| 3 | `floorUnitId(floor)` | `` `studyhall_units_floor${floor}` `` | `` `studyhall_rooms_${floor}F` `` | ✅ 1F〜5F 全階存在 |
| 4 | `floorSurfaceId(floor)` | `` `studyhall_surface_floor${floor}` `` | `` `studyhall_surface_${floor}F` `` | ✅ 1F〜5F 全階存在 |

**補足**: `toLogicalId()`（generate-manifest.js）の変換ルール（`imdf/{type}/{floor}.json` → `{type}_{floor}F`）と完全に一致。

### 2. 型エラー

- VSCode `get_errors` 確認: **エラー0件**
- `as MapId` アサーション: テンプレートリテラルを `keyof typeof geoJsonMap` に推論できないため、アサーションは正当かつ必要。

### 3. 他ファイル影響

- 旧IDパターン（`studyhall_footprint`, `interact_footprint`, `studyhall_units_floor`, `studyhall_surface_floor`）は全ファイルで使用なし
- 変更は `useBatchMapData.ts` 1ファイルに閉じている

### 4. Manhattan コンポーネントとの重なり確認

本タスクはMap要素の追加ではないため、該当せず。

---

## Findings

- `as MapId` アサーションは維持してよい。TypeScript は `\`studyhall_rooms_${floor}F\`` を `keyof typeof geoJsonMap` として自動推論しない。
- 修正は4行のみで最小限。ロジック変更なし。
- Manifestファイルへの影響はない（manifest は `toLogicalId()` で動的生成されるため）。

---

## TST への引き継ぎ指示

1. `npx tsc --noEmit` で型チェック再確認
2. 既存テストがあれば実行しレグレッション確認
3. テストパス後、ORCに最終報告
