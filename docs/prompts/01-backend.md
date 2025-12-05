# Step 1: Backend & DB Implementation (PostgreSQL)

## Context (Attach files)
- docs/spec-expense-app.md (必須)
- backend/ (ディレクトリ)
- docker-compose.yml (DB接続情報の参照用)

## Prompt
@docs/spec-expense-app.md および @docker-compose.yml を参照してください。
この仕様に基づき、backend/ ディレクトリ内に Express.js と Prisma を使用したAPIサーバーを実装してください。
データベースには Docker上の **PostgreSQL** を使用します。

要件:
1. `package.json` に必要な依存パッケージ (prisma, @prisma/client, express, cors, dotenv 等) を追加してください。
2. `backend/.env` ファイルを作成し、Dockerで起動しているPostgreSQLに接続するための `DATABASE_URL` を定義してください。
   - 接続情報: `postgresql://user:password@localhost:5432/mabl_demo_app?schema=public`
   - ※ `docker-compose` の設定値に合わせてください。
3. `prisma/schema.prisma` を初期化し、以下の設定を行ってください。
   - `provider = "postgresql"`
   - 仕様書のデータモデル (Expense) の定義
4. `prisma/seed.ts` を作成し、デモ用の初期データを数件投入できるようにしてください。
5. `src/server.ts` (または app.ts) で APIエンドポイント (GET/POST/PATCH) を実装してください。
6. `package.json` の scripts に、マイグレーション実行用 (`prisma migrate dev`) とシード実行用のコマンドを追加してください。

---

## セットアップ手順

### 1. PostgreSQL起動（Docker Compose）

```bash
# プロジェクトルートで実行
docker-compose up -d db
```

### 2. バックエンド環境構築

```bash
# backend ディレクトリに移動
cd backend

# 依存パッケージのインストール
npm install

# Prisma Clientの生成
npx prisma generate

# データベースマイグレーション実行
npx prisma migrate dev --name init

# シードデータの投入
npx prisma db seed
```

### 3. 開発サーバーの起動

```bash
# ローカルで起動（ポート 4000）
npm run dev

# または Docker Composeで起動
cd ..
docker-compose up api
```

---

## 動作確認

```bash
# ヘルスチェック
curl http://localhost:4000/health

# 経費一覧の取得
curl http://localhost:4000/api/expenses

# 新規経費の作成
curl -X POST http://localhost:4000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"title":"接待費","amount":5000}'

# ステータスの更新（IDは実際の値に置き換え）
curl -X PATCH http://localhost:4000/api/expenses/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"APPROVED"}'
```

---

## Prisma便利コマンド

```bash
# Prisma Studio起動（GUIでDBを確認）
npm run studio

# マイグレーションファイル確認
ls prisma/migrations

# DBスキーマを直接反映（開発用）
npm run db:push
```

---

## トラブルシューティング

### シードデータ投入時のTypeScriptエラー

**エラー:** `TS2591: Cannot find name 'process'` または `TS1295: ECMAScript imports...`

**解決策:**

1. `tsx`パッケージをインストール:
```bash
npm install --save-dev tsx
```

2. `package.json`のシード設定を確認:
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

3. シードを再実行:
```bash
npx prisma db seed
```