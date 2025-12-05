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