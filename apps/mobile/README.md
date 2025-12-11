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

### EAS Update（OTAアップデート）

アプリストアを経由せずにアップデートを配信できます：

```bash
# プレビュー環境に配信
eas update --channel preview --message "Bug fixes"

# 本番環境に配信
eas update --channel production --message "New features"
```

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

## CI/CD (GitHub Actions)

### 必要なシークレット

GitHub Actionsでビルドとデプロイを行うために、以下のシークレットをリポジトリに設定する必要があります。

#### Expo関連
- `EXPO_TOKEN`: Expoアクセストークン
  - 取得方法: https://expo.dev/accounts/[username]/settings/access-tokens
- `EXPO_USERNAME`: Expoユーザー名
- `EXPO_PUBLIC_API_URL`: APIのエンドポイントURL

**注**: `EXPO_PROJECT_ID`は不要です（`app.config.js`に記載済み）

#### mabl関連
- `MABL_API_KEY`: mabl APIキー
  - 取得方法: mablの設定ページから生成
- `MABL_WORKSPACE_ID`: mablワークスペースID
  - 確認方法: mablのワークスペース設定

#### GitHub関連（オプション）
- `PAT_TOKEN`: Personal Access Token（バージョンバンプのコミット用）
  - 権限: `repo` スコープ

### シークレットの設定方法

1. GitHubリポジトリの `Settings` → `Secrets and variables` → `Actions` に移動
2. `New repository secret` をクリック
3. 各シークレットの名前と値を入力して保存

### ワークフロー

#### Android APKビルド
- ファイル: `.github/workflows/build-mobile-android.yml`
- トリガー: `apps/mobile/**` の変更時、または手動実行
- 出力: APKファイル、mablへのアップロード、GitHubリリース

#### iOS アプリビルド
- ファイル: `.github/workflows/build-mobile-ios.yml`
- トリガー: 手動実行
- 出力: IPAファイル、mablへのアップロード

## プロジェクト構成

```
/apps/mobile
├── App.tsx           # メインアプリコンポーネント
├── index.ts          # エントリーポイント
├── app.config.js     # Expo設定ファイル（動的）
│                     # - EASプロジェクトID
│                     # - EAS Update URL
│                     # - ランタイムバージョン設定
├── eas.json          # EASビルド設定
├── .npmrc            # npm設定（legacy-peer-deps）
└── package.json      # 依存関係とスクリプト
```

## 重要な設定

### app.config.js

このファイルには以下の重要な設定が含まれています：

- **EASプロジェクトID**: `extra.eas.projectId`
- **EAS Update URL**: `updates.url`
- **ランタイムバージョン**: `runtimeVersion.policy = 'appVersion'`
- **アプリバージョン管理**: `cli.appVersionSource = 'remote'`

### 依存パッケージ

- `expo-updates`: OTAアップデート機能
- `react-native-web`: Web版のレンダリング
- その他のExpo SDKパッケージ

## 詳細情報

- [Expo ドキュメント](https://docs.expo.dev/) - Expoの機能とAPIについて
- [React Native ドキュメント](https://reactnative.dev/docs/getting-started) - React Nativeについて
- [EAS Build](https://docs.expo.dev/build/introduction/) - クラウドでアプリをビルド
- [mabl ドキュメント](https://help.mabl.com/) - mablモバイルテスト

## トラブルシューティング

### 依存関係の解決に問題が発生した場合

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### EAS初期化

ローカルでEASプロジェクトを初期化する場合:

```bash
eas init
```

### expo doctorでエラーが出る場合

```bash
npx expo install --check
npx expo install --fix
```

### Keystoreが見つからない場合

初回ビルド時にKeystoreを生成する必要があります：

```bash
eas build --platform android --profile preview-apk
```

対話モードで「Generate new keystore」を選択してください。

### EAS Updateが動作しない場合

`expo-updates`パッケージが正しくインストールされているか確認：

```bash
npx expo install expo-updates
eas update:configure
```
