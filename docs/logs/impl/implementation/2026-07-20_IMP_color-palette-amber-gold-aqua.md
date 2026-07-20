---
agent: IMP
task_id: TASK-colorPalette-002
date: 2026-07-20
status: draft
category: log
destination: docs/logs/impl/implementation/
tags:
  - IMP
  - implementation
  - colorPalette
---

# Implementation Log: カラーパレット変更（amber暗色化 / gold暗色化 / aqua新設）

## 概要
3ファイルを編集し、amber/gold のトーンを暗く調整し、aqua を新規追加。vending のマッピングを aqua に変更。

## 変更内容

### 1. `types.ts` — ColorGroup 型に aqua 追加
- `"amber"` と `"teal"` の間に `"aqua"` を追加

### 2. `tokens.ts` — LIGHT_TOKENS / DARK_TOKENS の色値変更

#### LIGHT_TOKENS
| Key | fill | line | circleFill |
|-----|------|------|------------|
| amber | `#FFF9C4` → `#E6D860` | `#FFF176` → `#D4C030` | `#FBC02D` → `#B09000` |
| gold | `#D4C830` → `#B8A820` | `#B8A820` → `#9A9018` | `#8E7600` → `#7A6000` |
| aqua (new) | `#B3E5FC` | `#81D4FA` | `#29B6F6` |

#### DARK_TOKENS
| Key | fill | line | circleFill |
|-----|------|------|------------|
| amber | `#4A4200` (fill のみ変更なし) | `#7A6E00` → `#6A5C00` | `#7A6E00` → `#8A7A00` |
| gold | `#352A18` → `#3D3018` | `#5D4818` → `#5D4820` | `#5D4818` → `#5D4820` |
| aqua (new) | `#003547` | `#004D6B` | `#00838F` |

### 3. `mappings.ts` — vending マッピング変更
- `vending: "salmon"` → `vending: "aqua"`

## 検証
- VSCode `get_errors`: 全3ファイル エラーなし ✅
- 型の一貫性: ColorGroup に aqua 追加 → tokens.ts の LIGHT/DARK 両方に aqua エントリ追加 → Record<ColorGroup, ...> でカバー済み
- 既存動作への影響: なし（vending → aqua は mappings.ts の1箇所のみ）

## 成果物パス
- `src/features/home/map/constants/colorPalette/types.ts`
- `src/features/home/map/constants/colorPalette/tokens.ts`
- `src/features/home/map/constants/colorPalette/mappings.ts`
