---
agent: REV
task_id: TASK-tab-persistence
date: 2026-07-20
status: approved
category: log
destination: docs/logs/impl/review/
related:
  - "[TASK-tab-persistence](app/(tabs)/_layout.tsx)"
tags:
  - REV
  - review
  - TASK-tab-persistence
---

# Review Log: Tab Persistence Fix（タブ永続化修正）

## Review Result

**判定: ✅ 承認**

CRITICAL 指摘なし。コードは目的通り正しく実装されている。

---

## Review Items

### 1. detachInactiveScreens={false}
- **結果: ✅ OK**
- Expo Router `<Tabs>` の正規 prop
- 非アクティブタブのネイティブビューを保持し、タブ切り替え時のアンマウントを防止
- v3 系以降の Expo Router で有効（`expo-router` の `<Tabs>` 内部で `@react-navigation/bottom-tabs` に伝播）

### 2. <Tabs.Screen name> と app/(tabs)/ 配下のフォルダ名一致
- **結果: ✅ OK**
- `index` → `app/(tabs)/index.tsx`（リダイレクト専用）
- `home` → `app/(tabs)/home/`（`_layout.tsx` + `index.tsx` + `search.tsx`）
- `tools` → `app/(tabs)/tools/`（`index.tsx`）
- `classroom` → `app/(tabs)/classroom/`（`index.tsx`）
- 全 name が実在のパスと一致、順序は `index` が先頭のデフォルトルートとして正しい

### 3. TabController.tsx router.push() との互換性
- **結果: ✅ OK**
- `ROUTE_MAP` 定義: `home→/(tabs)/home`, `tools→/(tabs)/tools`, `classroom→/(tabs)/classroom`
- `<Tabs>` 環境下で `router.push("/(tabs)/home")` は正しくタブ切り替えとして動作
- `detachInactiveScreens={false}` により push 後も前タブのビューが保持される
- `index` は `ROUTE_MAP` に存在せず、`TabController` の対象外 → 問題なし

### 4. home/_layout.tsx（SearchProvider）への影響
- **結果: ✅ OK**
- `<Tabs.Screen name="home" />` は `app/(tabs)/home/_layout.tsx` を正しく自動解決
- home の `_layout.tsx` は `<Slot />` で子画面を表示 — `<Tabs>` ラッパー内でも正常動作
- SearchProvider のコンテキストライフサイクルに影響なし

### 5. 型安全性
- **結果: ✅ OK**
- `get_errors` 確認済み: No errors found
- import path `@/src/shared/components` の `ScreenFC` が正しく解決されていることを確認

### 6. 追加観点: ScreenFC とカスタムタブバー
- **結果: ✅ OK**
- `<Tabs tabBar={() => null}>` でデフォルトタブバーを非表示
- `<ScreenFC visible="bottom" />` でカスタム BottomTabs を表示 → 設計に整合性あり
- ヘッダー・ボトムタブの絶対配置スタイルも問題なし

---

## Findings

- 変更は `_layout.tsx` の `<Slot />` → `<Tabs>` 置き換えのみで最小限
- tools / classroom に `_layout.tsx` は存在しないが、Expo Router は各ディレクトリの `index.tsx` を自動解決するため問題なし
- 他ファイルへの変更不要

## 特記事項

本レビューは TST への引き継ぎを前提としています。
