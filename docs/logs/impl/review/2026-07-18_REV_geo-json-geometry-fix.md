---
agent: REV
task_id: TASK-compass-002
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-compass-002](../shared/tasks/active/TASK-compass-002_geo-json-geometry-fix.md)"
tags:
  - REV
  - review
  - TASK-compass-002
---

# Review Log: GeoJSON Geometry Fix in processUnitData

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。コードは仕様通り正しく実装されている。

---

## Review Items

### 1. 型エラー
- `get_errors` → **0 errors** ✅
- `npx tsc --noEmit` ✅ (IMP 確認済み)
- `npx expo lint` ✅ (0 errors, IMP 確認済み)

### 2. GeoJSON Point geometry 形式
- `{ type: "Point", coordinates: [lng, lat] }` は正規の GeoJSON Point オブジェクト ✅
- 修正前 `geometry: f.properties.display_point`（配列を直接代入→無効）が修正後は有効な geometry に

### 3. 型アサーションの安全性
- `.filter()` で `Array.isArray(dp) && dp.length === 2` で事前確認 ✅
- `as [number, number]` はランタイムガード後の正当なアサーション

### 4. 呼び出し側の互換性

| コンポーネント | ファイル | Data Flow | 結果 |
|---|---|---|---|
| UnitSymbol | MapScreen.tsx:191 | `processedUnitGeoJson` (processUnitData結果) → `shape={pointData}` | ✅ |
| MapIconLabel | MapIconLabel.tsx | 内部で `useProcessedUnitData(data)` → `shape={processedGeoJson}` | ✅ |

両者とも Maplibre `ShapeSource` の `shape` prop 経由で FeatureCollection を受け取り、各 feature の geometry として Point オブジェクトを正しく解釈する。

### 5. コード品質
- 変更は map 内 1 箇所、最小限の修正
- フィルター条件で display_point の有無・配列長を検証済み（null-safety 担保）
- 追加 import 不要

---

## Findings
- 元のエラー「Geometry must be an object」の根本原因を正しく特定し修正済み
- 修正後のコードは GeoJSON 仕様（RFC 7946）に完全準拠
- 他ファイルへの影響なし
