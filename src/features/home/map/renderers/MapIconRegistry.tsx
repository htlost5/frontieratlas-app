// カテゴリ別アイコン画像 + 特殊シンボル画像のMapLibre Images登録コンポーネント
import { Images } from "@maplibre/maplibre-react-native";

// Type 1: 円形アイコン — 17カテゴリ × 2テーマ = 34個
import iconLearningLight from "@/assets/images/icons/MapView/map/categoryIcons/learning-light.png";
import iconLearningDark from "@/assets/images/icons/MapView/map/categoryIcons/learning-dark.png";
import iconLaboratoryLight from "@/assets/images/icons/MapView/map/categoryIcons/laboratory-light.png";
import iconLaboratoryDark from "@/assets/images/icons/MapView/map/categoryIcons/laboratory-dark.png";
import iconMeetingLight from "@/assets/images/icons/MapView/map/categoryIcons/meeting-light.png";
import iconMeetingDark from "@/assets/images/icons/MapView/map/categoryIcons/meeting-dark.png";
import iconLibraryLight from "@/assets/images/icons/MapView/map/categoryIcons/library-light.png";
import iconLibraryDark from "@/assets/images/icons/MapView/map/categoryIcons/library-dark.png";
import iconItLight from "@/assets/images/icons/MapView/map/categoryIcons/it-light.png";
import iconItDark from "@/assets/images/icons/MapView/map/categoryIcons/it-dark.png";
import iconListeningLight from "@/assets/images/icons/MapView/map/categoryIcons/listening-light.png";
import iconListeningDark from "@/assets/images/icons/MapView/map/categoryIcons/listening-dark.png";
import iconNurseryLight from "@/assets/images/icons/MapView/map/categoryIcons/nursery-light.png";
import iconNurseryDark from "@/assets/images/icons/MapView/map/categoryIcons/nursery-dark.png";
import iconStudioLight from "@/assets/images/icons/MapView/map/categoryIcons/studio-light.png";
import iconStudioDark from "@/assets/images/icons/MapView/map/categoryIcons/studio-dark.png";
import iconBroadcastingLight from "@/assets/images/icons/MapView/map/categoryIcons/broadcasting-light.png";
import iconBroadcastingDark from "@/assets/images/icons/MapView/map/categoryIcons/broadcasting-dark.png";
import iconPrintingLight from "@/assets/images/icons/MapView/map/categoryIcons/printing-light.png";
import iconPrintingDark from "@/assets/images/icons/MapView/map/categoryIcons/printing-dark.png";
import iconMusicLight from "@/assets/images/icons/MapView/map/categoryIcons/music-light.png";
import iconMusicDark from "@/assets/images/icons/MapView/map/categoryIcons/music-dark.png";
import iconJapaneseLight from "@/assets/images/icons/MapView/map/categoryIcons/japanese-light.png";
import iconJapaneseDark from "@/assets/images/icons/MapView/map/categoryIcons/japanese-dark.png";
import iconCookingLight from "@/assets/images/icons/MapView/map/categoryIcons/cooking-light.png";
import iconCookingDark from "@/assets/images/icons/MapView/map/categoryIcons/cooking-dark.png";
import iconSewingLight from "@/assets/images/icons/MapView/map/categoryIcons/sewing-light.png";
import iconSewingDark from "@/assets/images/icons/MapView/map/categoryIcons/sewing-dark.png";
import iconArtLight from "@/assets/images/icons/MapView/map/categoryIcons/art-light.png";
import iconArtDark from "@/assets/images/icons/MapView/map/categoryIcons/art-dark.png";
import iconWorkshopLight from "@/assets/images/icons/MapView/map/categoryIcons/workshop-light.png";
import iconWorkshopDark from "@/assets/images/icons/MapView/map/categoryIcons/workshop-dark.png";
import iconWasteLight from "@/assets/images/icons/MapView/map/categoryIcons/waste-light.png";
import iconWasteDark from "@/assets/images/icons/MapView/map/categoryIcons/waste-dark.png";
import iconStaffLight from "@/assets/images/icons/MapView/map/categoryIcons/staff-light.png";
import iconStaffDark from "@/assets/images/icons/MapView/map/categoryIcons/staff-dark.png";
import iconPrepLight from "@/assets/images/icons/MapView/map/categoryIcons/prep-light.png";
import iconPrepDark from "@/assets/images/icons/MapView/map/categoryIcons/prep-dark.png";

// Type 2: 特殊シンボル — 12個
import iconSpecialToiletMale from "@/assets/images/icons/MapView/MapLogo/special/special-toilet-male.png";
import iconSpecialToiletFemale from "@/assets/images/icons/MapView/MapLogo/special/special-toilet-female.png";
import iconSpecialToiletAccessible from "@/assets/images/icons/MapView/MapLogo/special/special-toilet-accessible.png";
import iconSpecialElevator from "@/assets/images/icons/MapView/MapLogo/special/special-elevator.png";
import iconSpecialVending from "@/assets/images/icons/MapView/MapLogo/special/special-vending.png";
import iconSpecialLocker from "@/assets/images/icons/MapView/MapLogo/special/special-locker.png";
import iconSpecialEmergencyExit from "@/assets/images/icons/MapView/MapLogo/special/special-emergency-exit.png";
import iconSpecialStairs from "@/assets/images/icons/MapView/MapLogo/special/special-stairs.png";
import iconSpecialStorage from "@/assets/images/icons/MapView/MapLogo/special/special-storage.png";
import iconSpecialFireDoor from "@/assets/images/icons/MapView/MapLogo/special/special-fire-door.png";
import iconSpecialChangingRoom from "@/assets/images/icons/MapView/MapLogo/special/special-changing-room.png";

const ICON_IMAGES: Record<string, number> = {
  "learning-light": iconLearningLight,
  "learning-dark": iconLearningDark,
  "laboratory-light": iconLaboratoryLight,
  "laboratory-dark": iconLaboratoryDark,
  "meeting-light": iconMeetingLight,
  "meeting-dark": iconMeetingDark,
  "library-light": iconLibraryLight,
  "library-dark": iconLibraryDark,
  "it-light": iconItLight,
  "it-dark": iconItDark,
  "listening-light": iconListeningLight,
  "listening-dark": iconListeningDark,
  "nursery-light": iconNurseryLight,
  "nursery-dark": iconNurseryDark,
  "studio-light": iconStudioLight,
  "studio-dark": iconStudioDark,
  "broadcasting-light": iconBroadcastingLight,
  "broadcasting-dark": iconBroadcastingDark,
  "printing-light": iconPrintingLight,
  "printing-dark": iconPrintingDark,
  "music-light": iconMusicLight,
  "music-dark": iconMusicDark,
  "japanese-light": iconJapaneseLight,
  "japanese-dark": iconJapaneseDark,
  "cooking-light": iconCookingLight,
  "cooking-dark": iconCookingDark,
  "sewing-light": iconSewingLight,
  "sewing-dark": iconSewingDark,
  "art-light": iconArtLight,
  "art-dark": iconArtDark,
  "workshop-light": iconWorkshopLight,
  "workshop-dark": iconWorkshopDark,
  "waste-light": iconWasteLight,
  "waste-dark": iconWasteDark,
  "staff-light": iconStaffLight,
  "staff-dark": iconStaffDark,
  "prep-light": iconPrepLight,
  "prep-dark": iconPrepDark,
  // 特殊シンボル
  "special-toilet-male": iconSpecialToiletMale,
  "special-toilet-female": iconSpecialToiletFemale,
  "special-toilet-accessible": iconSpecialToiletAccessible,
  "special-elevator": iconSpecialElevator,
  "special-vending": iconSpecialVending,
  "special-locker": iconSpecialLocker,
  "special-emergency-exit": iconSpecialEmergencyExit,
  "special-stairs": iconSpecialStairs,
  "special-storage": iconSpecialStorage,
  "special-fire-door": iconSpecialFireDoor,
  "special-changing-room": iconSpecialChangingRoom,
};

export function MapIconRegistry() {
  return <Images id="map-category-icons" images={ICON_IMAGES} />;
}
