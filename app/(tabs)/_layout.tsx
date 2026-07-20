// タブナビゲーション配下のレイアウトコンポーネント
// 子ルートの表示制御とボトムUIの表示を担当
// <Tabs> + detachInactiveScreens={false} でタブ切り替え時のアンマウントを防止

import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

import { ScreenFC } from "@/src/shared/components";

// タブレイアウト: 子ルート（各タブ画面）を表示し、ボトムUIを常駐
export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={() => null}
        screenOptions={{ headerShown: false }}
        detachInactiveScreens={false}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="home" />
        <Tabs.Screen name="tools" />
        <Tabs.Screen name="classroom" />
      </Tabs>
      <ScreenFC visible="bottom" />
    </View>
  );
}
