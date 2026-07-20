---
agent: IMP
task_id: TASK-slot-to-tabs
date: 2026-07-20
status: draft
category: log
destination: docs/logs/impl/implementation/
related:
  - "[TASK-slot-to-tabs]"
tags:
  - IMP
  - implementation
  - TASK-slot-to-tabs
---

# Implementation Log: Tab Unmount Fix

## Summary

`app/(tabs)/_layout.tsx` の `<Slot />` を Expo Router の `<Tabs>` に置き換え、`detachInactiveScreens={false}` を設定してタブ切り替え時の画面アンマウントを防止した。

## Changes

### Modified: `app/(tabs)/_layout.tsx`

| Before | After |
|--------|-------|
| `import { Slot } from "expo-router"` | `import { Tabs } from "expo-router"` |
| `<Slot />` | `<Tabs tabBar={() => null} screenOptions={{ headerShown: false }} detachInactiveScreens={false}>`...`</Tabs>` |

**キー設定:**
- `detachInactiveScreens={false}` — react-native-screens による非アクティブタブのデタッチを防止
- `tabBar={() => null}` — 組み込みタブバーを非表示にし、既存のカスタム `ScreenFC` ボトムバーはそのまま維持
- `screenOptions={{ headerShown: false }}` — ヘッダー非表示

**Tabs.Screen 登録:**
- `index`, `home`, `tools`, `classroom` — `app/(tabs)/` 配下のフォルダ/ファイルと一致

## Verification

- `get_errors`: 型エラーなし
- `npx tsc --noEmit`: コンパイルエラーなし
- `TabController.tsx` の `router.push(ROUTE_MAP[name])` は変更不要（Expo Router の `<Tabs>` は `router.push()` による画面遷移を正しくハンドリングする）

## Open Questions

なし
