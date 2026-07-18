---
agent: TST
task_id: TASK-compass-001
date: 2026-07-18
status: approved
category: log
destination: docs/logs/impl/testing/
related:
  - "[TASK-compass-001](../../../shared/tasks/active/TASK-compass-001_compass-feature.md)"
tags:
  - TST
  - testing
  - TASK-compass-001
---

# Test Log: 1F Surface as underlaySurface for 2F/3F

## Test Result

**判定: ✅ 合格**

全テスト項目パス。

---

## Test Items

### 1. `npx tsc --noEmit`

| 項目 | 結果 |
|------|------|
| コマンド | `npx tsc --noEmit` |
| 出力 | なし（成功） |
| 結果 | ✅ pass |

### 2. VSCode `get_errors` on changed file

| 項目 | 結果 |
|------|------|
| 対象 | `mobile/src/features/home/map/hooks/dataLoad/mapLayerCache.ts` |
| 結果 | No errors found |

### 3. コード検証: 2F/3F に 1F surface が underlaySurface として設定されていること

```ts
// L93-101
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

✅ 確認済

### 4. コード検証: 4F/5F は従来通り 3F surface が underlaySurface であること

```ts
// L103+
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

✅ 既存ロジックに変更なし

### 5. コード検証: 1F は underlaySurface: null であること

- 初期ループ（L82-84）で全フロア `underlaySurface: null` で初期化
- 後処理ブロックは 2F/3F, 4F/5F のみ更新 → 1F は null のまま
✅ 確認済

### 6. コード検証: フロア範囲が排他的であること

| ブロック | 範囲 | surface 参照元 |
|----------|------|----------------|
| New | [2, 3] | floor1 (1F) |
| Existing | [4, 5] | floor3 (3F) |

✅ 範囲 `[2,3]` と `[4,5]` は排他的で重複なし

---

## Summary

全6項目のテストを実施し、全て合格。コードは仕様通り正しく実装されており、既存ロジックへの影響もない。

**結果: ✅ 合格**
