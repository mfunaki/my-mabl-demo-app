# 指示: Web Frontendの実装

`apps/web` ディレクトリに、Next.js (App Router) を使用した管理画面を実装してください。

## 参照ファイル
* `/docs/spec-expense-app.md` (Web仕様)
* `/apps/api/prisma/schema.prisma` (型定義の参考)

## 要件
1. **Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS.
2. **Pages:**
    * `/login`: マネージャー (`manager`/`manager123`) ログイン画面。
    * `/dashboard`: 申請一覧と承認ボタン。
3. **API連携:**
    * サーバーコンポーネント用: `INTERNAL_API_URL` (例: `http://backend:4000`)
    * クライアントコンポーネント用: `NEXT_PUBLIC_API_URL` (例: `http://localhost:4000`)
4. **テスト属性 (重要):**
    * mablでのテストを可能にするため、仕様書の「5. Web仕様」に記載された `data-testid` を各要素に必ず付与すること。
    * 特にリストの各行には `expense-row-${id}`、承認ボタンには `approve-button-${id}` を付与してください。

このプロンプトへの回答として、主要なソースコード（`page.tsx`, `layout.tsx`, APIクライアント等）を出力してください。