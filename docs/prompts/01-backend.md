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