---
agent: REV
task_id: TASK-compass-002
date: 2026-07-18
status: critical
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-compass-002](../shared/tasks/active/TASK-compass-002_buildings-floor-removal.md)"
tags:
  - REV
  - review
  - TASK-compass-002
---

# Review Log: Buildings(floor) レイヤー廃止

## Review Result

**判定: 🔴 CRITICAL — IMP 差し戻し**

TypeScript シンタックスエラーが1件検出された。Expo プロジェクトの型エラー残存は CRITICAL 基準に該当する。

---

## CRITICAL 指摘事項

### C001: `lineStyle` JSX 式の閉じ `}` 欠落

**ファイル**: `src/features/home/map/layers/buildings/index.tsx:34`
**エラー**: `tsc --noEmit` → `error TS1005: '}' expected.` (L35:9)

**現状 (broken)**:
```tsx
lineStyle={getBuildingsLineStyle(colorTheme.buildings)
        );
```

**修正後**:
```tsx
lineStyle={getBuildingsLineStyle(colorTheme.buildings)}
        );
```

---

## 条件付き指摘（C001 修正時に併せて対応推奨）

### W001: 未使用 `variant` デストラクチャリング

**ファイル**: `src/features/home/map/layers/buildings/index.tsx:18`
`variant = "dim"` が関数体内で未使用。`variant` prop 削除時に残存したデッドコード。

```tsx
// 修正後
export const BuildingsView = React.memo(function BuildingsView({
  data,
  visible,
  colorTheme,
}: Props) {
```

---

## 各ファイルステータス

| ファイル | ステータス | 備考 |
|----------|-----------|------|
| MapScreen.tsx | ✅ OK | variant="floor" ブロック削除済、他レイヤー順序維持 |
| buildings/index.tsx | ❌ CRITICAL | シンタックスエラー + デッドコード |
| buildings/style.ts | ✅ OK | floor 関数削除、dim 関数維持 |
| colorPalette.ts | ✅ OK | buildingFloor 完全削除 |

## 全体クリーンナップ

- `buildingFloor` 残存参照 (grep): 0件 ✅
- `get_errors` (VSCode): No errors found (※ tsc --noEmit は検出)
- `tsc --noEmit`: ❌ 1 error → C001
