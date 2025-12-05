# Step 2: Web Application (Next.js)

## Context (Attach files)
- docs/spec-expense-app.md
- apps/web/ (ディレクトリ)
- backend/prisma/schema.prisma (※Backend実装後に生成されたファイルをAttachすると型定義の精度が上がります)

## Prompt
@docs/spec-expense-app.md を参照してください。
apps/web/ ディレクトリ内に、仕様書に基づいた Next.js (App Router) アプリケーションを実装してください。

要件:
1. UIコンポーネントには Tailwind CSS を使用してください。
2. `/login` 画面: 
    - 仕様書の `data-testid` を必ず付与したフォームを作成してください。
    - 認証ロジックはデモ用に簡易的なハードコード (demo-user/password123) で実装してください。
3. `/dashboard` 画面: 
    - `http://localhost:4000/api/expenses` からデータを取得して一覧表示してください。
    - **重要:** 各行 (`tr`)、各ボタンには仕様書通りの `data-testid` (例: `expense-row-${id}`) を必ず付与してください。これがmablのテスト実行時に要素を特定する鍵となります。
    - 各行の「承認」ボタンを押すと、PATCH リクエストを送り、画面上のステータスを更新してください。

---

## セットアップ手順

```bash
# apps/web ディレクトリに移動
cd apps/web

# 依存パッケージのインストール
npm install

# 開発サーバーの起動（ポート 3000）
npm run dev
```

## 動作確認

1. ブラウザで `http://localhost:3000` にアクセス
2. ログイン画面が表示される
3. `demo-user` / `password123` でログイン
4. ダッシュボードで経費一覧が表示される
5. 「承認」ボタンをクリックしてステータスが更新されることを確認

## 重要な data-testid 属性

### ログイン画面
- `username-input`: ユーザー名入力欄
- `password-input`: パスワード入力欄
- `login-button`: ログインボタン
- `error-message`: エラーメッセージ

### ダッシュボード
- `logout-button`: ログアウトボタン
- `expense-row-{id}`: 各経費行
- `status-text-{id}`: ステータステキスト
- `approve-button-{id}`: 承認ボタン
- `reject-button-{id}`: 却下ボタン

## トラブルシューティング

### peer dependency エラーが出る場合

**エラー:** `ERESOLVE could not resolve`

**解決策:**

1. `.npmrc`ファイルを作成:
```bash
echo "legacy-peer-deps=true" > .npmrc
```

2. クリーンインストール:
```bash
rm -rf node_modules package-lock.json
npm install
```

3. それでも解決しない場合:
```bash
npm install --legacy-peer-deps
```

### モノレポ構成の場合

各プロジェクト（`backend/`, `apps/web/`, `apps/mobile/`）は独立したnode_modulesを持ちます。必ず各ディレクトリで個別に`npm install`を実行してください。