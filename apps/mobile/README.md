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
npx expo export --platform web --output-dir web-build
```

静的ファイルが `web-build` ディレクトリに生成されます。

## ローカルでのWeb版動作確認

### 方法1: 開発サーバーで確認（最も簡単）

```bash
# Web版を起動
npm run web
```

ブラウザで [http://localhost:8081](http://localhost:8081) を開いて確認できます。

### 方法2: ビルド版をローカルサーバーで確認

```bash
# 環境変数を設定
export EXPO_PUBLIC_API_URL="http://localhost:8000"

# Web用にビルド
npx expo export --platform web --output-dir web-build

# ローカルサーバーで配信
cd web-build
npx serve -p 8080

# または Python を使用
python3 -m http.server 8080
```

ブラウザで [http://localhost:8080](http://localhost:8080) を開いて確認できます。

### 方法3: Dockerでの動作確認（本番環境に最も近い）

```bash
# Dockerイメージをビルド
docker build \
  --build-arg EXPO_PUBLIC_API_URL="http://localhost:8000" \
  -t expense-mobile-web:local \
  -f Dockerfile.local \
  .

# コンテナを起動
docker run -p 8080:8080 expense-mobile-web:local

# ブラウザで確認
# http://localhost:8080
```

#### Docker認証エラーが発生した場合

```bash
# 認証設定をリセット
rm ~/.docker/config.json
echo '{"auths":{}}' > ~/.docker/config.json

# イメージを事前にプル
docker pull node:20-alpine
docker pull nginx:alpine

# 再度ビルド
docker build --build-arg EXPO_PUBLIC_API_URL="http://localhost:8000" \
  -t expense-mobile-web:local -f Dockerfile.local .
```

## Web版のデプロイ（Google Cloud Run）

### 前提条件

以下のGitHub Secretsが設定されている必要があります：

- `GCP_PROJECT_ID`: Google CloudプロジェクトID
- `WIF_PROVIDER`: Workload Identity Federationプロバイダー
- `WIF_SERVICE_ACCOUNT`: サービスアカウント
- `EXPO_PUBLIC_API_URL`: APIエンドポイントURL

### 自動デプロイ

`apps/mobile/**` のファイルを変更して `main` ブランチにプッシュすると、自動的にビルドとデプロイが実行されます。

```bash
git add apps/mobile/
git commit -m "Update mobile web app"
git push origin main
```

### 手動デプロイ

GitHub Actionsの「Actions」タブから「Build and Deploy Mobile Web」ワークフローを選択し、「Run workflow」をクリックします。

### デプロイ先URLの確認方法

デプロイ完了後、以下の方法でURLを確認できます：

#### 1. GitHub Actionsのログ

- ワークフロー実行ログの「Output service URL」ステップ
- 「Summary」タブに表示されるQRコード付きURL

#### 2. GitHubリリース

- リポジトリの「Releases」セクション
- タグ: `mobile-web-v1.0.X`
- リリースノートに **Service URL** が記載

#### 3. Google Cloud Console

```bash
gcloud run services describe expense-mobile-web \
  --platform managed \
  --region asia-northeast1 \
  --format 'value(status.url)'
```

または、ブラウザで：
https://console.cloud.google.com/run → `expense-mobile-web` サービスを選択

### デプロイされるURL
