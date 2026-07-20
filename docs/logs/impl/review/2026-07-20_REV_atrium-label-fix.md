---
agent: REV
task_id: TASK-atrium-label-fix
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-atrium-label-fix]"
tags:
  - REV
  - review
  - atrium-label-fix
---

# Review Log: Atrium ラベル非表示化修正

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。修正は仕様通り正しく実装されている。

---

## 確認項目

### 1. 型エラー

- `configs.ts`: エラーなし ✅
- `LabelConfigs.ts`: エラーなし ✅
- `npx expo lint`: 出力なし（成功）✅
- `npx tsc --noEmit`: 出力なし（成功）✅

### 2. `buildCategoryFilter` の存続確認

`index.tsx` で引き続き `buildCategoryFilter` を import して使用している（line 5, 22）。ポリゴン描画に影響なし ✅

### 3. `buildCategoryFilter` vs `buildLabelFilter` の差分確認

| 関数 | visible=false 除外 | label設定チェック | 用途 |
|---|---|---|---|
| `buildCategoryFilter` | ✅ `isFeatureVisible(v)` | ❌ なし | ポリゴン描画 (`index.tsx`) |
| `buildLabelFilter` | ✅ `isFeatureVisible(v)` | ✅ `config.label.icon \|\| config.label.text` | ラベル描画 (`LabelConfigs.ts`) |

差分は意図通り ✅

### 4. atrium / fire_door が waste ラベルから除外されること

**`buildLabelFilter("waste")` の動作シミュレーション:**

waste グループの構成要素:
| category.json キー | GeoJSON 値 | visible | label.icon | label.text | buildLabelFilter 通過? |
|---|---|---|---|---|---|
| fire_door | "fire_door" | true | false | false | ❌ (icon=false, text=false) |
| atrium | "atrium" | true | false | false | ❌ (icon=false, text=false) |
| waste_room | "waste_room" | true | true | true | ✅ (icon=true) |

→ 期待通りのフィルタリング ✅

### 5. 他のグループでのラベル無効項目のフィルタリング

**structure グループ:**
| キー | label.icon | label.text | 通過? |
|---|---|---|---|
| structure | false | false | ❌ |
| locker_area | false | false | ❌ |
| storage | false | false | ❌ |
| emergency_exit | false | false | ❌ |
| rooftop | false | false | ❌ |

→ structure グループのラベルレイヤーは空フィルタ `["==", ["get", "category"], ""]` になる。
→ 画面上は何も表示されず期待通り ✅

### 6. `buildLabelOverrides` の some() ロジックへの影響確認

`buildLabelOverrides("waste")`:
- waste_room の `isLabelIconVisible` → true（category.json: label.icon=true）
- waste_room の `isLabelTextVisible` → true（category.json: label.text=true）
- `anyIcon = true`, `anyText = true`
- → `overrides["waste"] = { iconVisible: true, textVisible: true }`

atrium と fire_door は `buildLabelFilter` で **既にフィルタ除外** されるため、overrides が true でも表示されない。
some() ロジック変更不要 ✅

---

## Findings

- 変更は最小限: `configs.ts` の `buildLabelFilter` 追加（15行）と `LabelConfigs.ts` の import 差し替え（1行）+ filter prop 変更（1行）
- 既存の `buildCategoryFilter` は完全に独立して維持
- グループ内混在パターン（waste: atrium❌ + waste_room✅）が正しく処理される
- 空フィルタによる恒偽式でラベルレイヤー自体は存在するが描画されない設計で問題なし

---

## Open Questions

なし
