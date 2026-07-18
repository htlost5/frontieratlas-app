---
agent: IMP
task_id: TASK-symbol-reconstruction-001
date: 2026-07-18
status: draft
category: log
destination: docs/logs/impl/implementation/
tags:
  - IMP
  - implementation
  - symbol-reconstruction
---

# 実装ログ: シンボル表示の4分類再構築

## 概要
ARC の設計に従い、地図上のシンボル表示を Type 1〜4 に再分類する実装を完了した。

## 変更ファイル一覧（12ファイル）

| # | ファイル | 変更内容 |
|---|---------|---------|
| 1 | `mobile/category.json` | 全38キーの visible/label.icon/label.text/poi を Type 1〜4 に基づき再設定 |
| 2 | `mobile/src/features/home/map/constants/colorPalette.ts` | RoomCategory を 8→18拡張、ColorGroup 型+ROOM_COLOR_GROUP 追加、テーマ rooms のキーを ColorGroup に変更 |
| 3 | `mobile/src/features/home/map/layers/floor/unit/rooms/configs.ts` | ROOM_CATEGORY_MAP を 38→24キー（POI/Hidden 除外）に再構成、CATEGORIES 18要素に拡張、getDisplayMode 追加 |
| 4 | `mobile/src/features/home/map/layers/floor/unit/rooms/poiConfigs.ts` | **新規作成**。POI 12種の設定マップ+動的 expression 生成関数群 |
| 5 | `mobile/src/features/home/map/config/categoryDisplayConfig.ts` | getPoiGeoJsonCategories を poiConfigs.ts へ委譲 |
| 6 | `mobile/src/features/home/map/renderers/MapIconRegistry.tsx` | 7→17カテゴリ×2テーマ=34個 + 7→12特殊シンボル=46個の画像登録に拡張 |
| 7 | `mobile/src/features/home/map/renderers/UnitSymbol.tsx` | ハードコード→poiConfigs の動的生成 expression に切替、visibility→iconOpacity |
| 8 | `mobile/src/features/home/map/renderers/labels/LabelConfigs.ts` | 18 RoomCategory 対応に拡張、courtyard の iconVisible=false 対応 |
| 9 | `tools/map-assets/scripts/convert-tabler-icons.ts` | 7→17カテゴリ+library/courtyard に拡張、色を ColorGroup に同期 |
| 10 | `tools/map-assets/scripts/convert-special-symbols.ts` | 7→12特殊シンボルに拡張、Tabler アイコン名を実在ファイルに修正 |

**追加修正:**
| 11 | `mobile/src/features/home/map/layers/floor/unit/rooms/index.tsx` | ColorGroup 経由で rooms を参照するよう修正（型エラー対処） |

## 型チェック結果
- `npx tsc --noEmit`: **エラーなし** ✅

## 検証項目
- [x] category.json 全38キーに変更漏れなし
- [x] ROOM_CATEGORY_MAP に POI/Hidden キーが含まれていない（24キーのみ）
- [x] POI_CATEGORY_MAP に Type 1 キーが含まれていない
- [x] 全アイコンスクリプトが circleFill 色を持っている
- [x] TypeScript 型エラーなし

## 次工程への引き継ぎ
REV にコードレビューを依頼する。
