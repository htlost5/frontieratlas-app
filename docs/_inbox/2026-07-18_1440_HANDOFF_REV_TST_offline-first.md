---
agent: REV
task_id: TASK-offline-first-001
date: 2026-07-18
status: pending
category: log
destination: docs/_inbox/
related:
  - "[TASK-offline-first-001](../shared/tasks/active/TASK-offline-first-001_offline-first.md)"
tags:
  - REV
  - handoff
  - TASK-offline-first-001
---

# HANDOFF: REV → TST

## Metadata
| Field | Value |
|-------|-------|
| **From** | REV |
| **To** | TST |
| **Task ID** | TASK-offline-first-001 |
| **Status** | approved (conditional) |
| **Confidence** | high |
| **Handoff Type** | forward |

---

## Task Context（継承セクション）

> このセクションは ORC → DEV → ARC → IMP → REV → TST で継承される。

### Original Request
**tools リリースフロー条件分岐 + mobile ローカルアセット参照への切替**

1. `tools/.github/workflows/release.yml` — `upload_to_cloudflare` boolean input 追加 + step 条件分岐
2. `mobile/src/data/urls.ts` — 削除（Cloudflare URL定数不要）
3. `mobile/src/data/geojson/service/UpdateService.ts` — 削除（リモート更新ロジック不要）
4. `mobile/src/data/geojson/index.ts` — `checkAndUpdate()` をローカルバンドル比較に書き換え

### Constraints
- `usePrepareData.ts` のインターフェースは変更しない
- `checkAndUpdate()` の戻り値型 `Promise<UpdateResult[]>` は変更しない
- 削除ファイルの参照が他にないか確認してから削除すること

---

## Key Findings / Decisions

### レビュー結果サマリ

| 観点 | 結果 |
|------|------|
| `release.yml` 条件分岐構文 | ✅ 正確（`inputs.upload_to_cloudflare` boolean + 2ステップの `if:` 条件とも正しい） |
| 削除ファイルの残存参照 | ✅ なし（`urls.ts`/`UpdateService.ts` はファイル不在、grep で他ファイル参照0件） |
| `checkAndUpdate()` ロジック | ✅ 妥当（バンドル version vs SQLite version 比較 → 不一致時のみリストア） |
| `assetManifest` import 解決 | ✅ 問題なし（`AssetRestoreService.ts` と同一パターン） |
| `usePrepareData.ts` 互換性 | ✅ 維持（import/呼び出しIF変更なし） |
| `npx tsc --noEmit` | ✅ Pass（0 errors） |
| `npx expo lint` | ⚠️ 0 errors, 5 warnings（軽微） |

### レビュー指摘事項（条件付き承認）

| # | 重大度 | ファイル | 内容 |
|---|--------|----------|------|
| w1 | 軽微 | `index.ts:7` | `LocalManifest` が import されているが関数内で未使用（lint warning） |
| w2 | 情報 | `index.ts:63-78` | `checkAndUpdate()` は常に空配列 `[]` を返す。`usePrepareData.ts` の `results.filter(r => r.status === 'failed')` は空配列で正常動作する |

CRITICAL 指摘なし。

---

## Artifacts
| Path | Type | Description |
|------|------|-------------|
| `tools/.github/workflows/release.yml` | modified | `upload_to_cloudflare` input + step 条件分岐追加 |
| ~~`mobile/src/data/urls.ts`~~ | deleted | Cloudflare URL定数削除 |
| ~~`mobile/src/data/geojson/service/UpdateService.ts`~~ | deleted | リモート更新ロジック削除 |
| `mobile/src/data/geojson/index.ts` | modified | `checkAndUpdate()` 書き換え |

---

## Verification Results
| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | ✅ Pass (0 errors) |
| `npx expo lint` | ⚠️ 0 errors, 5 warnings |
| Grep: `UpdateService` outside deleted file | ✅ None |
| Grep: `from.*urls` | ✅ None |
| `usePrepareData.ts` import compatible | ✅ Yes |

---

## TST 確認項目
- [ ] `npx tsc --noEmit` が通ること（IMP/REV で確認済みだが念のため）
- [ ] `npx expo lint` がエラーなく通ること（warnings は許容）
- [ ] `index.ts` → `usePrepareData.ts` の呼び出しチェーンが正しく動作すること
- [ ] `tools/.github/workflows/release.yml` の `workflow_dispatch` 入力が正しいこと
- [ ] 削除ファイルの残骸がビルドに影響しないこと

CRITICAL 指摘発生時のみ ORC にエスカレーション。

---

## Open Questions
なし

---

## Routing
| Field | Value |
|-------|-------|
| **Next Agent** | TST |
| **Blockers** | none |
| **Priority** | medium |
| **Deadline** | — |
