# 指示: Web Frontendの実装

`apps/web` ディレクトリに、Next.js (App Router) を使用した管理画面を実装してください。

## 参照ファイル
* `/docs/spec-expense-app.md` (Web仕様)
* `/apps/api/prisma/schema.prisma` (型定義の参考)

## 要件

### 1. Tech Stack
Next.js 14+ (App Router), TypeScript, Tailwind CSS, axios.

### 2. ディレクトリ構成
```
apps/web/
├── app/
│   ├── page.tsx              # ランディングページ（/loginへリダイレクト）
│   ├── layout.tsx            # ルートレイアウト
│   ├── login/
│   │   └── page.tsx          # ログイン画面
│   └── dashboard/
│       ├── page.tsx          # ダッシュボード（サーバーコンポーネント）
│       └── ExpenseTable.tsx  # 経費テーブル（クライアントコンポーネント）
└── lib/
    ├── api.ts                # APIクライアント（axios）
    ├── auth.ts               # 認証ヘルパー（ローカルストレージ）
    └── types.ts              # 型定義（Expense等）
```

### 3. Pages
* `/`: ランディングページ。ログイン状態に応じて `/login` または `/dashboard` へリダイレクト。
* `/login`: マネージャー (`manager`/`manager123`) ログイン画面。
* `/dashboard`: 申請一覧と承認ボタン。ログアウト・全データ削除機能を含む。

### 4. コンポーネント構成
* **ダッシュボード** (`dashboard/page.tsx`): サーバーコンポーネント。初期データを取得してExpenseTableに渡す。
* **ExpenseTable** (`dashboard/ExpenseTable.tsx`): クライアントコンポーネント。承認・リセット・ログアウト操作を処理。

### 5. API連携
* サーバーコンポーネント用: `INTERNAL_API_URL` (例: `http://backend:4000`)
* クライアントコンポーネント用: `NEXT_PUBLIC_API_URL` (例: `http://localhost:4000`)

### 6. 認証
* ローカルストレージに `username` を保存する簡易実装。
* パスワード検証: `{username}123` 形式（例: `manager` → `manager123`）。
* APIリクエスト時に `Authorization` ヘッダーにユーザー名を設定。

### 7. テスト属性 (重要)
mablでのテストを可能にするため、以下の `data-testid` を各要素に必ず付与すること。

**ログイン画面:**
* `login-title`: ログインタイトル
* `login-error`: エラーメッセージ
* `username-input`: ユーザー名入力欄
* `password-input`: パスワード入力欄
* `login-button`: ログインボタン

**ダッシュボード:**
* `total-count`: 件数表示
* `total-amount`: 合計金額表示
* `reset-button`: 全データ削除ボタン
* `logout-button`: ログアウトボタン
* `error-message`: エラーメッセージ
* `empty-message`: データなしメッセージ

**経費テーブル（各行）:**
* `expense-row-${id}`: 経費行
* `expense-id-${id}`: ID列
* `expense-title-${id}`: タイトル列
* `expense-applicant-${id}`: 申請者列
* `expense-amount-${id}`: 金額列
* `expense-status-${id}`: ステータス列
* `expense-created-${id}`: 申請日時列
* `approve-button-${id}`: 承認ボタン

このプロンプトへの回答として、主要なソースコード（`page.tsx`, `layout.tsx`, `ExpenseTable.tsx`, APIクライアント等）を出力してください。