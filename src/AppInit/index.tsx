// AppInit の公開エクスポートをまとめる。
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useLoadFonts } from "./hooks/baseSet/useLoadFonts";
import usePrepareData from "./hooks/usePrepareData";

type Props = {
  children: React.ReactNode;
};

export default function AppInit({ children }: Props) {
  // 基盤のロード
  const baseReady = useLoadFonts();
  const dataReady = usePrepareData(baseReady);

  // ロード完了後スプラッシュ消す
  useEffect(() => {
    if (baseReady) {
      (async () => SplashScreen.hideAsync())();
    }
  }, [baseReady]);

  if (!baseReady) return null;
  if (!dataReady)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={"red"} size={50} />
      </View>
    );

  return <View style={{ flex: 1 }}>{children}</View>;
}

// 初期設計：base -> data の処理を順に行う（直列型）

/*
  設計案：
  splash表示中: base + dataロードの一部
  activeindicator: dataの残り

  ※dataロードで分離する場所を明確にする
*/
