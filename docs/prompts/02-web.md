# Step 2: Web Application (Next.js)

## Context (Attach files)
- docs/spec-expense-app.md
- apps/web/ (ディレクトリ)
- backend/schema.prisma (型定義の参照用にあると精度向上)

## Prompt
@docs/spec-expense-app.md を参照してください。
apps/web/ ディレクトリ内に、仕様書に基づいた Next.js (App Router) アプリケーションを実装してください。

要件:
1. UIコンポーネントには Tailwind CSS を使用してください。
2. `/login` 画面: 仕様書の `data-testid` を必ず付与したフォームを作成してください。認証はハードコードで構いません。
3. `/dashboard` 画面: 
    - `http://localhost:4000/api/expenses` からデータを取得して一覧表示してください。
    - 各行、各ボタンには仕様書通りの `data-testid` (expense-row-${id} 等) を付与してください。これがmablのテストで必須です。
    - 承認ボタンを押すと PATCH リクエストを送り、画面を更新してください。