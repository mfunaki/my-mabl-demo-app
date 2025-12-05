# Step 1: Backend & DB Implementation

## Context (Attach files)
- docs/spec-expense-app.md (必須)
- backend/ (ディレクトリ自体、または package.json)

## Prompt
@docs/spec-expense-app.md を参照してください。
この仕様に基づき、backend/ ディレクトリ内に Express.js と Prisma (SQLite) を使用したAPIサーバーを実装してください。

要件:
1. `schema.prisma` を作成し、仕様書のデータモデル(Expense)を定義してください。
2. `seed.ts` を作成し、デモ用の初期データを数件投入できるようにしてください。
3. `server.ts` (または app.ts) で APIエンドポイント (GET/POST/PATCH) を実装してください。
4. フロントエンドからの接続許可のため、CORS設定を適切に行ってください。
5. 必要な依存パッケージ (prisma, @prisma/client, express, cors 等) をインストールするコマンドも提示してください。