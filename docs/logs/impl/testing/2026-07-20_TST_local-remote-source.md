---
agent: TST
task_id: TASK-modification-001
date: 2026-07-20
status: failed  # 事前存在エラー有りのため、ORC 判断による
category: log
destination: docs/logs/impl/testing/
related:
  - "[geo-data-version.json](../../../../config/geo-data-version.json)"
  - "[src/data/geojson/index.ts](../../../../src/data/geojson/index.ts)"
tags:
  - TST
  - testing
  - TASK-modification-001
---

# Testing Log: データ取得元 local/remote 切替

## Test Result

**判定: ⚠️ 不合格（事前存在エラー有）**

Tester Decision Rules: Expo プロジェクトでは lint エラーまたは型エラーがある場合、テスト実施前に不合格と判定する。

ただし、今回の変更ファイルに起因するエラーは**0件**。全エラーは事前存在の `geojsonAssetMap.ts` のモジュール解決不可エラーのみ。

→ CRITICAL ではないため、差し戻し判断は ORC に委ねる。

---

## テスト項目詳細

### 1. `npx tsc --noEmit` — ❌ エラーあり（事前存在）

**今回の変更ファイル（`index.ts`, `geo-data-version.json`）には型エラーなし。**

- `get_errors` で `index.ts` → No errors ✅
- `get_errors` で `geo-data-version.json` → No errors ✅

既存エラー（変更範囲外）:
```
src/data/geojson/geojsonAssetMap.ts:31
  Cannot find module '@/assets/maps/version.json'
```

### 2. `npx expo lint` — ❌ 1 error（事前存在）, 8 warnings（事前存在）

- 今回の変更ファイル起因の error/warning は **0件**
- 全 warning は事前存在の未使用変数等

### 3. ロジック確認（コードレビューによる）

| # | 確認項目 | 結果 | 根拠 |
|---|---------|------|------|
| 1 | `source: "local"` 時、R2 sync スキップログ | ✅ | `index.ts:90-91` — `else { console.log("[GeoJsonInit] Data source is local, skipping R2 sync"); }` |
| 2 | `source: "remote"` 時、既存フロー実行 | ✅ | `index.ts:82-88` — `if (configSource === "remote") { ... remoteService.syncIfNeeded(); }` |
| 3 | `source` なし旧 config のフォールバック | ✅ | `index.ts:79` — `(geoDataConfig as { version: string; source?: string }).source ?? "local"` — `source` を optional にし `?? "local"` でフォールバック |
| 4 | JSON import 型アサーション | ✅ | `index.ts:79` — `as { version: string; source?: string }` で正しく型アサーション |

### 4. 既存テスト — ⚠️ テストファイルなし（プロジェクトにテストが未整備）

---

## 変更ファイルのエラー確認

| ファイル | 型エラー | Lint エラー |
|---------|---------|------------|
| `config/geo-data-version.json` | 0 ✅ | 0 ✅ |
| `src/data/geojson/index.ts` | 0 ✅ | 0 ✅ |

---

## 総括

- 変更内容のロジックは**すべて正しい**
- 今回の変更ファイルに起因するエラーは**ゼロ**
- 事前存在の `geojsonAssetMap.ts` のモジュール解決不可エラーが `tsc --noEmit` および `expo lint` で検出される
- テストファイルはプロジェクトに未整備のため、ユニットテストは未実施

Tester Decision Rules の "Expo プロジェクトでは lint エラーまたは型エラーがある場合、テスト実施前に不合格と判定する" に従い ⚠️ 不合格。

**推奨**: 変更範囲外の事前存在エラーであるため、ORC 判断で合格とみなして次工程へ進むことを推奨。
