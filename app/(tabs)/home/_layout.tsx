// home タブ配下のレイアウト: SearchProvider + MapRoot を常駐させ、Slot をオーバーレイ表示
import { Slot } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { SearchProvider } from "@/src/features/home/search/Context/SearchContext";
import { MapRoot } from "@/src/features/home/map/MapRoot";
import { MapControlsFC } from "@/src/features/home/map/components/controls";

export default function HomeLayout() {
  // MapRoot の children を安定化し、再描画を防止
  const mapControls = useMemo(() => <MapControlsFC />, []);

  return (
    <SearchProvider>
      <View style={styles.container}>
        {/* マップレイヤ — 常にマウント */}
        <MapRoot>{mapControls}</MapRoot>

        {/* Slot オーバーレイ — サブルート（index/search）を絶対配置で前面に */}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <Slot />
        </View>
      </View>
    </SearchProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
