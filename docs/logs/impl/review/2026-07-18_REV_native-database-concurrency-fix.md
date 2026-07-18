---
agent: REV
task_id: TASK-compass-001
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[useBatchMapData](../../../../src/features/home/map/hooks/dataLoad/useBatchMapData.ts)"
tags:
  - REV
  - review
  - TASK-compass-001
---

# Review Log: NativeDatabase 同時 prepareAsync クラッシュ修正

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。コードは仕様通り正しく実装されている。

---

## Review Items

### 1. Promise.all 同時 SQLite アクセス排除 ✅

| 箇所 | 修正前 | 修正後 | 結果 |
|------|--------|--------|------|
| venue 読み込み (L145-153) | `Promise.all([getGeoDataByLogicalId ×4])` | `repo.getMany(venueIds)` + `getOrAsset` | ✅ 1回のバッチ呼び出し |
| floor 読み込み (L192-197) | `Promise.all([getGeoDataByLogicalId ×2])` | `repo.getMany(floorIds)` + 個別フォールバック | ✅ 1回のバッチ呼び出し |
| プリロード (L82-89) | 既存の `repo.getMany()` | 変更なし | ✅ 既にバッチ統一済み |

全3箇所で `Promise.all` による同時ネイティブ呼び出しが排除されている。

### 2. アセットフォールバックの一貫性 ✅

`preloadAllFloors()` と floor データ読み込み部のフォールバックパターンを比較:

```typescript
// === preloadAllFloors() (L96-106) ===
let units = batchResult.get(unitId) ?? null;
if (!units) {
  const asset = geoJsonMap[unitId];
  if (asset) units = sanitizeFeatureCollection(asset.content as FeatureCollection);
} else {
  units = sanitizeFeatureCollection(units);
}

// === useBatchMapData floor 部 (L199-215) ===
let units = floorBatch.get(floorUnitId(floor)) ?? null;
if (!units) {
  const asset = geoJsonMap[floorUnitId(floor)];
  if (asset) units = sanitizeFeatureCollection(asset.content as FeatureCollection);
} else {
  units = sanitizeFeatureCollection(units);
}
```

完全に同一パターン。`surface` も同様。

venue 部は `getOrAsset` ヘルパーに集約され、SQLite ミス時は必須エラーを throw する設計 → venue データの必須性を考慮し妥当。

### 3. 未使用 import 削除 ✅

- `getGeoDataByLogicalId` の import は useBatchMapData.ts から削除済み
- `getGeoDataByLogicalId` の他ファイルでの使用箇所: 定義ファイル (`services/getGeoDataByLogicalId.ts`) のみ
- 削除に伴う影響: なし（現在の export 保持、他モジュールからの利用継続可能）

### 4. 型エラー ✅

VSCode `get_errors` 確認: **No errors found**

### 5. 他ファイルへの副作用 ✅

- 関数シグネチャ: 変更なし
- 戻り値型 (`BatchMapData`): 変更なし
- エクスポート: 変更なし
- プリロードキャッシュの型: 変更なし
- 他のコンポーネントからの呼び出しパターンに影響なし

---

## ID 整合性確認

| 定数 | geoJsonMap キー | 存在 |
|------|----------------|------|
| `MAP_LOGICAL_IDS.venue` | `venue_venue` | ✅ |
| `MAP_LOGICAL_IDS.studyhall` | `studyhall_surface` | ✅ |
| `MAP_LOGICAL_IDS.interact` | `interact_surface` | ✅ |
| `MAP_LOGICAL_IDS.stair` | `studyhall_stairs` | ✅ |
| `floorUnitId(floor)` | `studyhall_rooms_{1-5}F` | ✅ |
| `floorSurfaceId(floor)` | `studyhall_surface_{1-5}F` | ✅ |

全 ID が `geoJsonMap` のキーとして存在することを確認。

---

## 指摘事項

**CRITICAL: なし**

**軽微コメント:**
- venue 部の `getOrAsset` が必須エラー (`throw new Error`) なのに対し、floor 部のフォールバックは `null` を許容する。これは venue データ必須 vs フロアデータ欠落許容という意図的な設計差異と判断。条件付き承認対象外。

---

## HANDOFF

```
status: approved
confidence: high

== 成果物パス ==
- レビュー対象: mobile/src/features/home/map/hooks/dataLoad/useBatchMapData.ts
- 参照: mobile/src/data/geojson/geojsonAssetMap.ts
- 実装ログ: mobile/docs/logs/impl/implementation/2026-07-18_IMP_native-database-concurrency-fix.md
- レビューログ: mobile/docs/logs/impl/review/2026-07-18_REV_native-database-concurrency-fix.md

== TST確認項目 ==
[ ] npx tsc --noEmit が通ること
[ ] 既存テストが存在すれば実行しパスすること
[ ] 型チェックの再確認

CRITICAL指摘発生時のみORCにエスカレーション。
```
