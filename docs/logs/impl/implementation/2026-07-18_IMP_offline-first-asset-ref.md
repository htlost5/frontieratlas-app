---
agent: IMP
task_id: TASK-offline-first-001
date: 2026-07-18
status: draft
category: log
destination: docs/logs/impl/implementation/
tags:
  - IMP
  - implementation
  - TASK-offline-first-001
---

# Implementation Log: Tools Release Condition + Local Asset Reference

## Summary

| Item | Value |
|------|-------|
| **Task** | TASK-offline-first-001 |
| **Agent** | IMP |
| **Status** | success |
| **Confidence** | high |

## Changes

### 1. `tools/.github/workflows/release.yml`
- Added `upload_to_cloudflare` boolean input (default: `false`) to `workflow_dispatch.inputs`
- Added `if: inputs.upload_to_cloudflare` to "Upload to R2 & Cleanup" step
- Added `if: inputs.upload_to_cloudflare && vars.PUSH_WORKER_URL != ''` to "Notify Worker (push trigger)" step

### 2. `mobile/src/data/urls.ts` — Deleted
- `REMOTE_BASE_URL`, `LATEST_URL`, `RELEASES_URL` removed
- No remaining references (verified via grep)

### 3. `mobile/src/data/geojson/service/UpdateService.ts` — Deleted
- Full remote update logic removed (fetchLatestVersionInfo, fetchBuildManifest, generateUpdatePlan, executeUpdate)
- No remaining references (verified via grep)

### 4. `mobile/src/data/geojson/index.ts` — Modified
- Removed `UpdateService` and `QuotaExceededError` imports
- Added `assetManifest` import from `@/assets/maps/manifest.json`
- Rewrote `checkAndUpdate()` to compare bundle version vs SQLite cached version:
  - If versions match → no-op
  - If bundle is newer → restore from assets via `AssetRestoreService`
- `initializeGeoData()`, `setOnQuotaExceeded()`, `GeojsonRepository` export preserved unchanged
- `usePrepareData.ts` interface unchanged (still imports `initializeGeoData`, `checkAndUpdate`)

## Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | ✅ Pass (no output = no errors) |
| VSCode get_errors (`index.ts`) | ✅ No errors |
| VSCode get_errors (`usePrepareData.ts`) | ✅ No errors |
| Grep: `UpdateService` references outside deleted file | ✅ None |
| Grep: `urls.ts` references outside deleted file | ✅ None |

## Quality Gate
- [x] フロントマター完全
- [x] 未確定事項なし
- [x] コンパイルエラーなし
- [x] 変更ファイル一覧完備
- [x] 型チェック通過
