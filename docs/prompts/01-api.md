# 指示: プロジェクト基盤とBackend APIの作成

あなたは熟練したFull Stackエンジニアです。
VS Codeのワークスペースで、以下の仕様に基づきプロジェクトを作成してください。

## 参照ファイル
* `/docs/spec-expense-app.md`

## ステップ 1: インフラとモノリポ構成
1. **ディレクトリ構造:**
    * ルート直下に `apps/api`, `apps/web`, `apps/mobile` を配置する構成。
    * パッケージ管理は `npm workspaces` を使用（`apps/api` をワークスペースとして登録）。
2. **Docker Compose:**
    * `docker-compose.yml` をルートに作成。
    * `postgres` (DB), `backend` (API), `frontend` (Web) の3つのサービスを定義。
    * ネットワーク設定: 内部通信およびホストからのポートフォワード(DB:5432, API:4000, Web:3000)を設定。
    * APIサービスには環境変数 `DATABASE_URL`, `CORS_ORIGIN`, `PORT` を設定。

## ステップ 2: APIの実装 (apps/api)
`apps/api` ディレクトリに、Express と PostgreSQL を使用したREST APIを実装してください。
1. **Tech Stack:** Node.js, Express, pg (PostgreSQLクライアント), TypeScript.
2. **Database:**
    * `prisma/schema.prisma` を定義 (PostgreSQL)。`Expense` モデルを作成（スキーマ定義・マイグレーション用）。
    * **注意:** ランタイムでは Prisma Client ではなく、`pg` パッケージを使用した raw SQL でデータベース操作を行う。
    * アプリケーション起動時に `CREATE TABLE IF NOT EXISTS` でテーブルを自動作成する。
3. **Endpoints:**
    * 仕様書の「4. API 仕様」にあるエンドポイントを全て実装。
    * **重要:** `POST /api/reset` は `DELETE FROM expenses` を実行してデータを空にし、シーケンスをリセットする処理を実装すること。
    * 認証: `Authorization` ヘッダーの値をユーザー名として扱う簡易実装。
4. **CORS:** 環境変数 `CORS_ORIGIN` を読み込み設定すること（デフォルト: `http://localhost:3000`）。

このプロンプトへの回答として、実行すべきコマンドと、作成・編集すべきファイルの中身（コードブロック）を出力してください。