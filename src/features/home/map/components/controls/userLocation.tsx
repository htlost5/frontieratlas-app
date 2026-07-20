// ユーザー位置表示ボタン: マップ上で特定座標へカメラをジャンプするコンポーネント
// シンプルなピン型アイコンで表現
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { mapControlShadow } from "@/src/shared/constants/shadowStyles";
import { mapConfig } from "../../constants/mapConfig";
import { useMapContext } from "../../hooks/state/useMapContext";

const PIN_COLOR = "#007AFF";
const FRAME_COLOR = "#c1dfff"

export function UserLocation() {
  const { cameraRef, colorTheme } = useMapContext();
  const handlePress = () => {
    cameraRef.current?.flyTo(
      mapConfig.default.center,
      mapConfig.animation.duration.flyTo,
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colorTheme?.controls.floorBg ?? "#FFFFFF" },
      ]}
      onPress={handlePress}
    >
      {/* ピン先（丸） */}
      <View style={styles.frame} />
      <View style={styles.centerCircle} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 20,
    right: 10,
    bottom: 70,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
    ...mapControlShadow,
  },
  centerCircle: {
    position: "absolute",
    backgroundColor: PIN_COLOR,
    height: 10,
    width: 10,
    borderRadius: 100,
  },
  frame: {
    position: "relative",
    backgroundColor: FRAME_COLOR,
    height: 30,
    width: 30,
    borderRadius: 100
  }
});
