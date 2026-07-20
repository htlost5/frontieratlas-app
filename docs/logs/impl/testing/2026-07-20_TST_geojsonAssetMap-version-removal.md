---
agent: TST
task_id: TASK-geojson-version-removal
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/testing/
related:
  - "[geojsonAssetMap.ts](../../../src/data/geojson/geojsonAssetMap.ts)"
  - "[manifest.json](../../../assets/maps/manifest.json)"
tags:
  - TST
  - testing
  - geojsonAssetMap
  - version-removal
---

# Test Log: geojsonAssetMap から version 混入除去の検証

## テスト結果

**判定: ✅ 合格**

全4項目すべて合格。テスト失敗なし。

---

## テスト項目別結果

### 1. TypeScript 型チェック `npx tsc --noEmit`
- 実行コマンド: `npx tsc --noEmit`
- **結果: ✅ パス** — エラー出力なし

### 2. geojsonAssetMap.ts の整合性確認
| 確認項目 | 期待値 | 実測値 | 結果 |
|---------|--------|--------|------|
| `version` 文字列の有無 | 0件 | **0件** | ✅ |
| import 行数（.json） | 26 | **26** | ✅ |
| geoJsonMap エントリ数 | 26 | **26** | ✅ |

### 3. manifest.json の整合性確認
| 確認項目 | 期待値 | 実測値 | 結果 |
|---------|--------|--------|------|
| 有効なJSON | true | **true** | ✅ |
| `files` オブジェクトのキー数 | 26 | **26** | ✅ |
| `count` の値 | 26 | **26** | ✅ |
| `files` 内に `version` キー | なし | **なし** | ✅ |

### 4. get_errors 全ファイルチェック
- 対象: `src/data/geojson/` 配下全ファイル
- **結果: ✅ エラーなし**

---

## 検証詳細ログ

### 4.1. geojsonAssetMap.ts の version 文字列
```
grep "version" src/data/geojson/geojsonAssetMap.ts → 空（0件）
```

### 4.2. geojsonAssetMap.ts import 行（26行）
```
import address from "@/assets/maps/imdf/address.json";
import interact_rooms_1F from "@/assets/maps/imdf/interact/rooms/1F.json";
import interact_rooms_2F from "@/assets/maps/imdf/interact/rooms/2F.json";
import interact_surface_1F from "@/assets/maps/imdf/interact/surface/1F.json";
import interact_surface_2F from "@/assets/maps/imdf/interact/surface/2F.json";
import interact_surface_3F from "@/assets/maps/imdf/interact/surface/3F.json";
import interact_surface from "@/assets/maps/imdf/interact/surface.json";
import studyhall_rooms_1F from "@/assets/maps/imdf/studyhall/rooms/1F.json";
import studyhall_rooms_2F from "@/assets/maps/imdf/studyhall/rooms/2F.json";
import studyhall_rooms_3F from "@/assets/maps/imdf/studyhall/rooms/3F.json";
import studyhall_rooms_4F from "@/assets/maps/imdf/studyhall/rooms/4F.json";
import studyhall_rooms_5F from "@/assets/maps/imdf/studyhall/rooms/5F.json";
import studyhall_stairs from "@/assets/maps/imdf/studyhall/stairs.json";
import studyhall_surface_1F from "@/assets/maps/imdf/studyhall/surface/1F.json";
import studyhall_surface_2F from "@/assets/maps/imdf/studyhall/surface/2F.json";
import studyhall_surface_3F from "@/assets/maps/imdf/studyhall/surface/3F.json";
import studyhall_surface_4F from "@/assets/maps/imdf/studyhall/surface/4F.json";
import studyhall_surface_5F from "@/assets/maps/imdf/studyhall/surface/5F.json";
import studyhall_surface from "@/assets/maps/imdf/studyhall/surface.json";
import studyhall_surfaceback from "@/assets/maps/imdf/studyhall/surfaceback.json";
import studyhall_walkable_1F from "@/assets/maps/imdf/studyhall/walkable/1F.json";
import studyhall_walkable_2F from "@/assets/maps/imdf/studyhall/walkable/2F.json";
import studyhall_walkable_3F from "@/assets/maps/imdf/studyhall/walkable/3F.json";
import studyhall_walkable_4F from "@/assets/maps/imdf/studyhall/walkable/4F.json";
import studyhall_walkable_5F from "@/assets/maps/imdf/studyhall/walkable/5F.json";
import venue_venue from "@/assets/maps/imdf/venue/venue.json";
```

### 4.3. manifest.json のキー一覧（26件）
address, interact_rooms_1F, interact_rooms_2F, interact_surface_1F, interact_surface_2F, interact_surface_3F, interact_surface, studyhall_rooms_1F, studyhall_rooms_2F, studyhall_rooms_3F, studyhall_rooms_4F, studyhall_rooms_5F, studyhall_stairs, studyhall_surface_1F, studyhall_surface_2F, studyhall_surface_3F, studyhall_surface_4F, studyhall_surface_5F, studyhall_surface, studyhall_surfaceback, studyhall_walkable_1F, studyhall_walkable_2F, studyhall_walkable_3F, studyhall_walkable_4F, studyhall_walkable_5F, venue_venue

### 4.4. TypeScript 型チェック
```
$ npx tsc --noEmit
（出力なし＝エラーなし）
```

### 4.5. get_errors 結果
```json
{
  "filePaths": ["d:\\htlost5-workspace\\projects\\frontieratlas\\mobile\\src\\data\\geojson"],
  "result": "No errors found."
}
```

---
