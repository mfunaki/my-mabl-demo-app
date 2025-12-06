# 指示: Web Frontendの実装

`apps/web` ディレクトリに、Next.js (App Router) を使用した管理画面を実装してください。

## 参照ファイル
* `/docs/spec-expense-app.md` (Web仕様)
* (前工程で生成された) `apps/api/prisma/schema.prisma` (型定義の参考)

## 要件
1. **Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS.
2. **Pages:**
    * `/login`: マネージャーログイン画面。
    * `/dashboard`: 申請一覧と承認ボタン。
3. **API連携:**
    * サーバーコンポーネントでデータ取得する場合はDocker内部URL (`http://backend:4000`) を使用。
    * クライアント操作(承認ボタン等)は `NEXT_PUBLIC_API_URL` を使用。
4. **テスト属性:**
    * 仕様書の「5. Web仕様」に記載された `data-testid` を各要素に必ず付与すること。これがmablテストで必須となる。

## 成果物
* `apps/web` 配下の主要なソースコード (`page.tsx`, `layout.tsx`, API連携ロジック等)。
* `apps/web/Dockerfile`