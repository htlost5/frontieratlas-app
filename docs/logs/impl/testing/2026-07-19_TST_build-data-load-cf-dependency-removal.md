---
agent: TST
task_id: TASK-build-data-load-cf-removal
date: 2026-07-19
status: approved
category: log
destination: docs/logs/impl/testing/
related:
  - "[TASK-build-data-load-cf-removal]"
tags:
  - TST
  - testing
  - TASK-build-data-load-cf-removal
---

# Testing Log: build-data-load.js — Cloudflare 依存排除

## Test Result

**判定: ✅ 合格 (PASS)**

全 4 テストケース合格。CRITICAL な問題なし。

---

## Test Case Results

### TC1: 明示的バージョン指定 (v1.0.0)
**結果: ✅ PASS**

| 確認項目 | 結果 |
|----------|------|
| `assets/maps/` 作成 | ✅ 展開完了 |
| `assets/maps/manifest.json` 存在 | ✅ 確認 (5925 bytes) |
| `assets/maps/imdf/` 配下のファイル | ✅ address.json, interact/, studyhall/, venue/ |
| `geojsonAssetMap.ts` 生成 | ✅ `Wrote registry to ...` 確認 |

### TC2: latest 指定 → v1.1.0 解決
**結果: ✅ PASS**

| 確認項目 | 結果 |
|----------|------|
| `latest.json` → `v1.1.0` 解決 | ✅ `{ "version": "v1.1.0" }` → zip 展開成功 |
| zip 展開 | ✅ `assets/maps/imdf/` 正常展開 |

### TC3: 存在しないバージョン (v9.9.9) エラー
**結果: ✅ PASS**

| 確認項目 | 結果 |
|----------|------|
| エラーメッセージ | ✅ `ENOENT: no such file or directory, open '...releases\v9.9.9\imdf-v9.9.9.zip'` |
| スタックトレース | ✅ `at getData` → `at main` |
| exit code | ✅ `EXIT_CODE=1` |

### TC4: TypeScript 型チェック (`npx tsc --noEmit`)
**結果: ✅ PASS**

- `TSC_EXIT=0` (エラーなし)
- 全 27 件の TS2307 エラーは `assets/maps/` が未展開の場合のみ発生する既知の問題。展開後はゼロエラー。

---

## Summary

| テストケース | 結果 |
|-------------|------|
| TC1: v1.0.0 明示指定 | ✅ PASS |
| TC2: latest 解決 | ✅ PASS |
| TC3: 存在しないバージョン | ✅ PASS |
| TC4: 型チェック | ✅ PASS |
| **全体** | **✅ PASS** |

## 補足

- `npx tsc --noEmit` の TS2307 エラー (27件) は `assets/maps/` が存在しない場合に発生するが、これは `build-data-load.js` の変更に起因するものではなく、事前から存在する `declarations.d.ts` に JSON モジュールの型宣言がないため。
- スクリプト実行前のバックアップは正常に復元済み: `geo-data-version.json` → `{"version":"v1.0.0"}`

## ハンドオフ情報

- **TST 完了**: 全テスト合格
- **次のアクション**: ORC に結果を返却 → REL への委譲判断を仰ぐ
