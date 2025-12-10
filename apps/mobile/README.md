# モバイルアプリ

[React Native](https://reactnative.dev/) と [Expo](https://expo.dev/) で構築されたモバイルアプリケーションです。

## はじめに

### 必要な環境

- Node.js (v18 以降)
- npm または yarn
- iOS用: macOS と Xcode
- Android用: Android Studio と Android SDK

### インストール

```bash
npm install --legacy-peer-deps
```

## 開発

### 開発サーバーの起動

```bash
npm start
```

Expo開発サーバーが起動します。その後、以下の操作が可能です：
- `i` を押してiOSシミュレーターで起動
- `a` を押してAndroidエミュレーターで起動
- `w` を押してWebブラウザで起動
- QRコードをスキャンして実機のExpo Goアプリで起動

### iOSで実行

```bash
npm run ios
```

iOSシミュレーターでアプリを起動します。macOSとXcodeが必要です。

### Androidで実行

```bash
npm run android
```

Androidエミュレーターでアプリを起動します。Android StudioとAndroid SDKが必要です。

### Webで実行

```bash
npm run web
```

ブラウザで [http://localhost:8081](http://localhost:8081) を開いて確認できます。

Web版はReact Native Webを使用してモバイルアプリをブラウザでレンダリングします。

## 本番ビルド

### iOSビルド

```bash
# 開発ビルド
npx expo run:ios --configuration Release

# EASを使用した本番ビルド
npx eas build --platform ios
```

### Androidビルド

```bash
# 開発ビルド（APK）
npx expo run:android --variant release

# EASを使用した本番ビルド（Google Play用AAB）
npx eas build --platform android
```

### Webビルド

```bash
npx expo export:web
```

静的ファイルが `web-build` ディレクトリに生成されます。

## プロジェクト構成

```
/apps/mobile
├── App.tsx           # メインアプリコンポーネント
├── index.ts          # エントリーポイント
├── app.json          # Expo設定ファイル
└── package.json      # 依存関係とスクリプト
```

## 詳細情報

- [Expo ドキュメント](https://docs.expo.dev/) - Expoの機能とAPIについて
- [React Native ドキュメント](https://reactnative.dev/docs/getting-started) - React Nativeについて
- [EAS Build](https://docs.expo.dev/build/introduction/) - クラウドでアプリをビルド

## トラブルシューティング

依存関係の解決に問題が発生した場合は、以下を試してください：

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```
