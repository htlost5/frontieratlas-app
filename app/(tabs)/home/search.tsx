// 検索画面: 入力に応じた候補一覧を表示する
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useSearch } from "@/src/features/home/search/Context/SearchContext";
import { useSearchIndex } from "@/src/features/home/search/hooks/useSearchIndex";
import { useLiveSearch } from "@/src/features/home/search/hooks/useLiveSearch";
import type { SearchResultItem } from "@/src/features/home/search/types";
import { ICON_IMAGES } from "@/src/features/home/map/renderers/MapIconRegistry";
import { ROOM_CATEGORY_MAP } from "@/src/features/home/map/layers/floor/unit/rooms/configs";
import type { RoomCategory } from "@/src/features/home/map/constants/colorPalette";
import { FONT_SIZE } from "@/src/shared/constants/typography";

/**
 * GeoJSON カテゴリ値 → アイコン画像 の解決チェーン:
 * ROOM_CATEGORY_MAP[category] → RoomCategory → iconKey("-light") → ICON_IMAGES
 */
function resolveIcon(category: string): number | undefined {
  const roomCat: RoomCategory | undefined = ROOM_CATEGORY_MAP[category];
  if (!roomCat) return undefined;
  const iconKey = `${roomCat}-light`;
  return ICON_IMAGES[iconKey];
}

/**
 * 検索結果 1行のレンダリング（メモ化）
 */
const SearchResultRow = React.memo(function SearchResultRow({
  item,
  onPress,
}: {
  item: SearchResultItem;
  onPress: (item: SearchResultItem) => void;
}) {
  const iconSource = resolveIcon(item.category);

  return (
    <TouchableOpacity
      style={styles.resultRow}
      onPress={() => onPress(item)}
      activeOpacity={0.6}
    >
      <View style={styles.resultIconWrapper}>
        {iconSource ? (
          <Image style={styles.resultIcon} source={iconSource} />
        ) : (
          <View style={styles.resultIconFallback} />
        )}
      </View>
      <View style={styles.resultTextWrapper}>
        <Text style={styles.resultTextJa} numberOfLines={1}>
          {item.nameJa}
        </Text>
        <Text style={styles.resultTextEn} numberOfLines={1}>
          {item.nameEn}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

/**
 * 検索画面: 上部入力欄 + 候補一覧
 */
export default function SearchView() {
  const { searchText, setSearchText, setSelectedSearchResult } = useSearch();
  const indexState = useSearchIndex();
  const liveSearch = useLiveSearch(indexState);

  const handlePress = useCallback(
    (item: SearchResultItem) => {
      setSelectedSearchResult(item);
      router.back();
    },
    [setSelectedSearchResult],
  );

  const renderItem = useCallback(
    ({ item }: { item: SearchResultItem }) => (
      <SearchResultRow item={item} onPress={handlePress} />
    ),
    [handlePress],
  );

  const keyExtractor = useCallback(
    (item: SearchResultItem, index: number) =>
      item.id || `${item.floor}-${index}`,
    [],
  );

  const isEmptyQuery = useMemo(
    () => searchText.trim().length === 0,
    [searchText],
  );

  return (
    <View style={styles.container}>
      {/* 検索入力欄 */}
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="部屋・施設を検索"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          autoFocus
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchText("")}
            activeOpacity={0.6}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ローディング */}
      {liveSearch.status === "loading" && (
        <View style={styles.center}>
          <ActivityIndicator size="small" color="#999" />
        </View>
      )}

      {/* エラー */}
      {liveSearch.status === "error" && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{liveSearch.error}</Text>
        </View>
      )}

      {/* 候補一覧 */}
      {liveSearch.status === "ready" && (
        <FlatList
          data={liveSearch.results}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          removeClippedSubviews
          maxToRenderPerBatch={15}
          windowSize={5}
          initialNumToRender={10}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>
                {isEmptyQuery
                  ? "入力すると候補が表示されます"
                  : "検索結果がありません"}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchInputContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
  },
  searchInput: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 16,
    paddingRight: 40,
    fontSize: FONT_SIZE.searchBar,
    color: "#000",
  },
  clearButton: {
    position: "absolute",
    right: 20,
    top: 20,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
    lineHeight: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
  },
  resultIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  resultIcon: {
    width: "70%",
    height: "70%",
  },
  resultIconFallback: {
    width: "70%",
    height: "70%",
    borderRadius: 14,
    backgroundColor: "#DDD",
  },
  resultTextWrapper: {
    flex: 1,
  },
  resultTextJa: {
    fontSize: FONT_SIZE.searchBar,
    color: "#000",
    marginBottom: 2,
  },
  resultTextEn: {
    fontSize: FONT_SIZE.bodyLarge,
    color: "#888",
  },
  emptyText: {
    fontSize: FONT_SIZE.body,
    color: "#999",
  },
  errorText: {
    fontSize: FONT_SIZE.body,
    color: "#C00",
  },
});
