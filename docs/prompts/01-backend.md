# 指示: Backend APIの実装

`apps/api` ディレクトリに、Express と Prisma を使用したREST APIを実装してください。

## 参照ファイル
* `/docs/spec-expense-app.md` (特にAPI仕様とデータモデル)
* `/docker-compose.yml` (DB接続情報)

## 要件
1. **Tech Stack:** Node.js, Express, Prisma, TypeScript.
2. **Database:**
    * `prisma/schema.prisma` を定義 (PostgreSQL)。
    * `Expense` モデルを作成。
3. **Endpoints:**
    * 仕様書の「4. API 仕様」にあるエンドポイントを全て実装。
    * 特に `POST /api/reset` は `prisma.expense.deleteMany({})` を実行してデータを空にする処理を実装すること。
    * 認証ミドルウェア: `Authorization` ヘッダーからユーザー名を取得し、`req.user` にセットする簡易実装を行うこと。
4. **CORS:** 環境変数 `CORS_ORIGIN` を読み込み設定すること。

## 成果物
* `apps/api/package.json`
* `apps/api/prisma/schema.prisma`
* `apps/api/src/index.ts` (または関連ファイル)
* `apps/api/Dockerfile`