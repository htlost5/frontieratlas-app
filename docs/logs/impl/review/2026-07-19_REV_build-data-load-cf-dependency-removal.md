---
agent: REV
task_id: TASK-build-data-load-cf-removal
date: 2026-07-19
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-build-data-load-cf-removal]"
tags:
  - REV
  - review
  - TASK-build-data-load-cf-removal
---

# Review Log: build-data-load.js — Cloudflare 依存排除

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。Cloudflare HTTP 依存の排除が正しく実装されている。

---

## Review Items

### 1. 型の正しさ ✅
- `fs.readFileSync(zipPath)` はエンコーディング未指定のため **Buffer を返す**
- `unzipper.Open.buffer(buffer)` のシグネチャ `Open.buffer(buffer: Buffer)` に完全一致
- VSCode `get_errors`: エラーなし

### 2. パス解決の正しさ ✅
- 実機確認: `__dirname` (mobile/scripts/) → `../../tools/map-assets/releases/` で `d:\htlost5-workspace\projects\frontieratlas\tools\map-assets\releases` に解決
- ディレクトリ・zip ファイルの実在確認:
  - `releases/v1.1.0/imdf-v1.1.0.zip` ✅ (latest.json 参照先)
  - `releases/v1.0.0/imdf-v1.0.0.zip` ✅ (geo-data-version.json 参照先)

### 3. エラーハンドリング ✅
- `readFileSync` の ENOENT → `main()` catch ブロックで捕捉 → `console.error(e)` + `process.exit(1)`
- `JSON.parse` の SyntaxError → 同 catch ブロックで捕捉
- `unzipper.Open.buffer` / `directory.extract` の reject → `await` 経由で `main()` catch に伝播
- `version` 未設定時の早期 exit: `if (!version) { process.exit(1) }` ✅

### 4. 後方互換性 ✅
- 明示的バージョン (`v1.0.0`): `releases/v1.0.0/imdf-v1.0.0.zip` が存在、正常動作可能
- `latest` 指定: `latest.json` → `v1.1.0` → `imdf-v1.1.0.zip` の2段階解決も正しい

### 5. 非同期の整合性 ✅
- `getData()` は `unzipper.Open.buffer()` と `directory.extract()` が非同期 Promise を返すため `async` が **必要**
- `resetDir()` の `async` は不要（sync fs のみ）だが無害。`main()` から `await` されているため削除してもエラーにならないが、実害なしのため指摘しない

### 6. 残存 import ✅
- 全 import が使用中。`Buffer` import は削除済み。旧 `fetch` / `BASE_URL` / `LATEST_URL` / `ZIP_URL` の残存なし

### 7. 後続スクリプト連携 ✅
- `generateGeojsonAssetMap()` は `assets/maps/manifest.json` を期待 → `getData()` が zip を `assets/maps/` に展開してから呼ばれるため順序正しい

---

## Overall Assessment

| 観点 | ステータス |
|------|-----------|
| セキュリティ | ✅ 問題なし（外部ネットワーク通信削除により攻撃面減少） |
| 仕様準拠 | ✅ Cloudflare 依存排除を達成 |
| 型の安全性 | ✅ エラーなし |
| 可読性 | ✅ 行数削減、不要コード削除により改善 |
| 保守性 | ✅ ローカルファイル参照に統一、ビルドの再現性向上 |

---

## TST へのハンドオフ情報

**確認すべきテスト項目:**

1. **`v1.0.0`（明示的バージョン）の動作**
   - `geo-data-version.json`: `{ "version": "v1.0.0" }`
   - `node scripts/build-data-load.js` を実行
   - `assets/maps/` に展開されたファイル群が v1.0.0 の内容であること

2. **`latest` 指定の動作**
   - `geo-data-version.json`: `{ "version": "latest" }`
   - `node scripts/build-data-load.js` を実行
   - `assets/maps/` の内容が v1.1.0（= latest.json の指すバージョン）であること

3. **エラーケース**
   - `latest.json` が存在しない場合: `ENOENT` → `process.exit(1)`
   - 存在しないバージョンを指定した場合: `ENOENT` → `process.exit(1)`
   - `geo-data-version.json` の `version` が空/未設定の場合: "GetError: version情報を記載してください" → `process.exit(1)`

4. **型チェック**
   - `npx tsc --noEmit` が通ること

---

CRITICAL 発生時のみ ORC にエスカレーション。
