# Step 3: Mobile Application (React Native)

## Context (Attach files)
- docs/spec-expense-app.md
- apps/mobile/ (ディレクトリ)

## Prompt
@docs/spec-expense-app.md を参照してください。
apps/mobile/ ディレクトリ内に、仕様書に基づいた React Native (Expo) アプリケーションを実装してください。

要件:
1. `/app` ディレクトリ配下に画面を作成してください (Expo Router想定)。
2. ログイン画面と、経費申請/一覧画面を実装してください。
3. **重要:** すべての操作可能な要素（入力欄、ボタン、リストアイテム）に、仕様書で指定された `testID` を付与してください。これがAppium/mablでのテストに必須です。
4. API接続設定:
    - Androidエミュレーター(WSL2内)から同じWSL2上で動くAPIサーバーへアクセスするため、ベースURLは `http://10.0.2.2:4000` を固定で使用してください。
    - 実装の際は `.env` ファイルを利用し、変数名 `EXPO_PUBLIC_API_URL` として定義して参照するようにしてください。
5. 一覧画面には `RefreshControl` を使用した "Pull to Refresh" 機能を実装し、データを再取得できるようにしてください。

---

## セットアップ手順

```bash
# apps/mobile ディレクトリに移動
cd apps/mobile

# .envファイルを作成（テンプレートからコピー）
cp .env.example .env

# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm start

# Androidエミュレーターで実行
npm run android

# iOSシミュレーターで実行（Macのみ）
npm run ios
```

## 環境変数設定

`.env`ファイルで以下の環境変数を設定します：

```env
# WSL2 Androidエミュレーターから同じWSL2上のAPIサーバーへアクセス
EXPO_PUBLIC_API_URL=http://10.0.2.2:4000
```

**重要:** 
- WSL2環境では `10.0.2.2` を使用
- iOS Simulatorでは `localhost` または `127.0.0.1` を使用可能
- 実機テストの場合は、開発マシンのIPアドレス（例: `http://192.168.1.100:4000`）を設定

## 動作確認

1. Androidエミュレーターを起動
2. `npm run android` でアプリをビルド・起動
3. ログイン画面で `demo-user` / `password123` を入力
4. ホーム画面で経費を申請
5. 下に引っ張って Pull to Refresh が動作することを確認
6. Webダッシュボードで承認後、再度リフレッシュしてステータスが更新されることを確認

## 重要な testID 属性

### ログイン画面
- `username-input`: ユーザー名入力欄
- `password-input`: パスワード入力欄
- `login-button`: ログインボタン

### ホーム画面
- `title-input`: タイトル入力欄
- `amount-input`: 金額入力欄
- `submit-button`: 申請ボタン
- `expense-item-{title}`: 各経費アイテム
- `expense-status-{title}`: 各経費のステータステキスト

## API接続設定について

### WSL2環境（推奨）
Androidエミュレーターから同じWSL2上で動くAPIサーバーにアクセスするため、`10.0.2.2`を使用します。これはAndroidエミュレーターの特別なエイリアスで、ホストマシン（この場合はWSL2）のlocalhostを指します。

### その他の環境
- **iOSシミュレーター**: `localhost` または `127.0.0.1` が使用可能
- **実機デバイス**: 開発マシンと同じネットワーク上のIPアドレス（例: `192.168.1.100`）を指定

## トラブルシューティング

### API接続エラーが出る場合

1. バックエンドAPIが起動していることを確認:
```bash
cd backend
npm run dev
# http://localhost:4000/health でヘルスチェック
```

2. WSL2のIPアドレスを確認:
```bash
hostname -I
# 出力例: 172.x.x.x
```

3. 必要に応じて`.env`のAPI URLを変更
