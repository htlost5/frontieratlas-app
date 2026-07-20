---
agent: REV
task_id: TASK-iconsVisible-001
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[DD-iconsVisible]"
tags:
  - REV
  - review
  - iconsVisible
---

# Review Log: Global iconsVisible Toggle

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。コードは仕様通り正しく実装されている。

---

## Review Items

### 1. 型の正しさ ✅
- `MapContextValue` → `MapRoot` → `MapScreen` → `MapIconLabel` → `LabelLayer` の型チェーン完全
- VSCode get_errors: 全5ファイルエラーなし

### 2. 後方互換性 ✅
- `useState(true)` でデフォルト true
- `showIcon = iconsVisible && config.iconVisible` → true 時は従来の `config.iconVisible` と等価
- 既存動作との完全互換を確認

### 3. 非影響確認 ✅
| ファイル/設定 | 変更の有無 |
|---|---|
| UnitSymbol.tsx | 変更なし（iconsVisible 参照なし） |
| LabelConfig.ts | 変更なし（category-level iconVisible は維持） |
| POI | 変更なし |
| category.json | 変更なし |
| LabelConfigs | 変更なし |
| categoryDisplayConfig | 変更なし |

### 4. MapRoot memo 影響 ✅
- Context value は本変更前から `useMemo` なしのインライン生成
- 新 state 追加による追加再レンダリングの発生なし

### 5. Props 伝播完全性 ✅
- `MapScreen → MapIconLabel → LabelLayer` 全3段階で `iconsVisible` Props が正しく伝播
- 全コンポーネントの Props 型に明示的に定義済み

### 6. config.iconVisible → showIcon 置き換え漏れ ✅
- shareComp.tsx 内3箇所: iconImage / textAnchor / textOffset — 全て置換済み
- `grep_search` で残存ゼロを確認

---

## 変更ファイル一覧

| ファイル | 変更内容 |
|----------|----------|
| `src/features/home/map/context/MapContext.ts` | MapContextValue に iconsVisible/setIconsVisible 追加 |
| `src/features/home/map/MapRoot.tsx` | useState(true) + Provider value に追加 |
| `src/features/home/map/MapScreen.tsx` | useMapContext → MapIconLabel 伝播 |
| `src/features/home/map/renderers/MapIconLabel.tsx` | Props 追加 → LabelLayer 伝播 |
| `src/features/home/map/renderers/labels/shareComp.tsx` | showIcon 判定ロジック + 3箇所置換 |
