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
  - TASK-compass-001
---

# Review Log: 1F Surface as underlaySurface for 2F/3F

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。コードは仕様通り正しく実装されている。

---

## ファイル

| ファイル | 状態 |
|----------|------|
| `mobile/src/features/home/map/hooks/dataLoad/mapLayerCache.ts` | ✅ 変更あり（レビュー対象） |
| `mobile/src/features/home/map/hooks/dataLoad/useBatchMapData.ts` | ✅ 変更なし・確認済 |
| `mobile/src/features/home/map/MapScreen.tsx` | ✅ 変更なし・確認済 |

---

## チェック項目

### 1. 新規ブロックが既存パターンと同一であること ✅

新規ブロック（L80-90）:
```ts
const floor1 = floors.get(1);
if (floor1) {
  for (const f of [2, 3]) {
    const existing = floors.get(f);
    if (existing) {
      floors.set(f, { ...existing, underlaySurface: floor1.surface });
    }
  }
}
```

既存ブロック（L93-103）:
```ts
const floor3 = floors.get(3);
if (floor3) {
  for (const f of [4, 5]) {
    const existing = floors.get(f);
    if (existing) {
      floors.set(f, { ...existing, underlaySurface: floor3.surface });
    }
  }
}
```

✅ 完全に同一パターン（参照元 surface のみ異なる: floor1 vs floor3）

### 2. フロア範囲の重複がないこと ✅

- 新規ブロック: 2F/3F ← 1F surface
- 既存ブロック: 4F/5F ← 3F surface
- 範囲は `[2,3]` と `[4,5]` で排他的 → 重複なし

### 3. 1F に underlaySurface が設定されていないこと ✅

- 初期ループ（L68-73）で全フロア `underlaySurface: null` で初期化
- 後処理ブロックは 2F/3F と 4F/5F のみ更新 → 1F は null のまま

### 4. toFloorGeoData() がジェネリックに through すること ✅

`useBatchMapData.ts` L50:
```ts
underlaySurface: fc.underlaySurface,
```
変更不要。既存のジェネリック実装がそのまま機能する。

### 5. MapScreen.tsx がジェネリックに rendering すること ✅

`MapScreen.tsx` L150-156:
```tsx
{batchData.floorData?.underlaySurface && (
  <SurfaceLayer
    prefixId="surface_underlay"
    data={batchData.floorData.underlaySurface}
    ...
    belowLayerID="fillLayer_surface_current"
  />
)}
```
変更不要。既存のジェネリック実装がそのまま機能する。

### 6. 型エラーなし ✅

- VSCode get_errors: 3ファイルともエラーなし
- `npx tsc --noEmit`: 出力なし（成功）

### 7. 不要な変更なし ✅

- 変更は `mapLayerCache.ts` のみ
- 追加されたコードは 2F/3F underlay ブロック（約10行）のみ
- 他ファイルへの影響なし

---

## まとめ

シンプルで正確な実装。既存の 4F/5F underlay（3F surface）と完全に同じパターンを踏襲し、2F/3F に対して 1F surface を underlaySurface として設定している。フロア範囲の重複もなく、1F 自身は underlay を持たない（bottom floor として正しい）。Consumer 側（useBatchMapData / MapScreen）は既にジェネリック対応済みのため変更不要。

**承認。TST へ引き継ぐ。**
