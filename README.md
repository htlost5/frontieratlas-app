# Frontier Atlas (Mobile App) 🗺️

屋内マップアプリケーション「Frontier Atlas」の Expo React Native モバイルアプリ。

## 要件

- Node.js >= 20
- Expo CLI

## 開発

```bash
npm install
npx expo start
```

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm start` | Expo 開発サーバ起動 |
| `npm run android` | Android エミュレータで実行 |
| `npm run ios` | iOS シミュレータで実行 |
| `npm run lint` | ESLint チェック |
| `npm run version:patch` | パッチバージョンアップ |
| `npm run data:load` | マップデータを R2 から取得 |
| `npm run data:gen-registry` | GeoJSON レジストリ生成 |

## アーキテクチャ

- **フレームワーク**: Expo SDK 57 + React Native 0.86
- **マップ**: @maplibre/maplibre-react-native
- **データ配信**: Cloudflare R2（[frontieratlas-geo-tools](https://github.com/htlost/frontieratlas-geo-tools) で管理）

## 関連リポジトリ

- [frontieratlas-geo-tools](https://github.com/htlost/frontieratlas-geo-tools) — マップアセットパイプライン
