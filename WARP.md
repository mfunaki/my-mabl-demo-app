# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## プロジェクト概要

Expense App は、社員がモバイルアプリから経費を申請し、マネージャーが Web ダッシュボードから承認する mabl デモ用の経費管理アプリです。Google Cloud Run 上にデプロイされる複数のアプリケーションで構成されています。

- **Backend API** (`apps/api`): Express + TypeScript + PostgreSQL
- **Web Frontend** (`apps/web`): Next.js 14 (App Router) + Tailwind CSS
- **Mobile App** (`apps/mobile`): Expo + React Native
- **E2E Web Tests** (`tests/web`): Playwright による Web ダッシュボードの E2E テスト

ローカルでは Docker Compose で API・Web・PostgreSQL をまとめて起動するか、各アプリを個別に起動して開発します。

## よく使うコマンド

すべて特記がなければリポジトリルートで実行します。

### 全体: Docker Compose でのローカル起動

- すべての主要サービスを起動（PostgreSQL, Backend API, Web Frontend）
  - `docker-compose up -d`
- 停止とクリーンアップ
  - `docker-compose down`

起動後の想定エンドポイント:
- PostgreSQL: `localhost:5432`
- Backend API: `http://localhost:4000`
- Web Frontend: `http://localhost:3000`

### ルート npm スクリプト

- Backend API をワークスペース経由で起動
  - `npm run dev:api`
- Web Frontend を起動
  - `npm run dev:web`

### Backend API (`apps/api`)

```bash
cd apps/api
# 依存関係インストール
npm install

# Prisma 関連
npm run prisma:generate   # Prisma Client 生成
npm run prisma:migrate    # prisma migrate dev
npm run prisma:studio     # Prisma Studio を開く

# 開発サーバー (ホットリロード)
npm run dev

# ビルド & 本番起動
npm run build
npm start
```

環境変数の前提（特に Cloud Run / ローカル DB 接続）:
- `DATABASE_URL`（必須）: PostgreSQL 接続文字列
- `CORS_ORIGIN`（任意）: 許可するフロントエンドの Origin（デフォルト: `http://localhost:3000`）
- `PORT`（任意）: ポート（Cloud Run では 8080、ローカルでは 4000 前提）

### Web Frontend (`apps/web`)

```bash
cd apps/web
npm install

# 開発サーバー (Next.js dev)
npm run dev

# 本番ビルド & 起動
npm run build
npm start

# Lint
npm run lint
```

環境変数の前提:
- `NEXT_PUBLIC_API_URL`: ブラウザ側から呼び出す API エンドポイント
- `INTERNAL_API_URL`: サーバーコンポーネント/SSR から利用する API エンドポイント

### Mobile App (`apps/mobile`)

```bash
cd apps/mobile
npm install

# Expo 開発サーバー
npm start

# 各プラットフォーム
npm run ios
npm run android
npm run web
```

環境変数の前提:
- `EXPO_PUBLIC_API_URL`: モバイルアプリ（および Web ビルド）が向き先とする Backend API URL

### Web E2E テスト (`tests/web`)

```bash
cd tests/web

# 依存関係 & ブラウザインストール
npm install
npx playwright install

# 全テスト実行
npm test

# UI モード（テストフローの可視化に便利）
npm run test:ui

# デバッグ / headed 実行
npm run test:debug
npm run test:headed

# 特定テストのみ
npx playwright test manager-expense-approval
npx playwright test --grep "Step 1"

# ブラウザ別
npm run test:chromium
npm run test:firefox
npm run test:webkit

# レポート表示
npm run test:report
```

Playwright の設定では以下を前提としています:
- Web: `http://localhost:3000`
- API: `http://localhost:4000`

`tests/web/playwright.config.ts` の `webServer` 設定により、必要に応じて `apps/web` 側の開発サーバーを自動起動します。

## アーキテクチャ概要

### データフロー全体

- Mobile (Expo) / Web (Next.js) → Backend API (Express) → PostgreSQL (Cloud SQL / ローカルは Docker 上の Postgres)
- 認証はすべて HTTP ヘッダ `Authorization` によるシンプルなユーザー識別で行われます。
  - `manager`: 全経費にアクセス可能
  - `employee` などそれ以外: 自分の申請のみ参照可能
  - パスワードは `{username}123` 形式（例: `manager` / `manager123`）。

### Backend API (`apps/api`)

単一の Express アプリ (`src/index.ts`) で全エンドポイントを定義しています。Prisma はスキーマ定義とマイグレーション用で、実行時は `pg` の生クエリを使用します。

- 起動時に `DATABASE_URL` をチェックし、未設定ならエラーで停止。
- `Pool` を使って PostgreSQL に接続。
- `checkDatabase()` で起動時に `expenses` テーブルを自動作成し、スキーマを保証。
- CORS は `CORS_ORIGIN` 環境変数（デフォルト `http://localhost:3000`）を利用して設定。

主要エンドポイント:
- `GET /api/expenses`
  - `Authorization` ヘッダからユーザー名を取得。
  - `manager` の場合は全経費、それ以外は `applicant_id` が自身のレコードのみ返却。
- `POST /api/expenses`
  - `manager` 以外のみ利用可能（`manager` は 403）。
  - `title`, `amount` を受け取り、新しい経費レコードを作成。
- `PATCH /api/expenses/:id/status`
  - `manager` のみ利用可能。
  - `status` は `APPROVED` または `REJECTED` のみ許可。
- `POST /api/reset`
  - 全経費レコードを削除し、`id` のシーケンスをリセット。
- `POST /api/migrate`
  - 手動マイグレーション用の互換エンドポイント（`expenses` テーブルが存在しない場合に作成）。

Prisma スキーマ (`apps/api/prisma/schema.prisma`) では `Expense` モデルと `ExpenseStatus` enum を定義しつつ、テーブル名・カラム名は DB 上の `expenses`, `applicant_id`, `created_at` にマッピングしています。

### Web Frontend (`apps/web`)

Next.js 14 の App Router 構成です。Tailwind CSS による簡易 UI で、マネージャー向けの経費承認ダッシュボードを提供します。

- `app/layout.tsx`
  - 全ページ共通の HTML ラッパーとメタデータ（タイトル: 「経費管理アプリ - Manager」など）を定義。
- `app/page.tsx`
  - ルート (`/`) にアクセスした際に `/login` へリダイレクトするエントリーポイント。
- `app/login/page.tsx`
  - クライアントコンポーネントとしてログインフォームを提供。
  - `@/lib/auth` の `login()` を呼び出し、認証成功時に `/dashboard` へ遷移。
  - `data-testid` 属性を付与しており、Playwright テストで安定して要素を特定できるようになっています。
- `app/dashboard/page.tsx`
  - サーバーコンポーネントとして `expenseApi.getAll(true)` で全経費を取得し、`ExpenseTable` に初期データとして渡します。
  - `export const dynamic = 'force-dynamic';` により、常に最新のデータを取得する設定。
- `app/dashboard/ExpenseTable.tsx`
  - クライアントコンポーネントとして、経費テーブルの表示・承認・リセット・ログアウト機能を提供。
  - `@/lib/api` を通じて API を呼び出し、状態をローカルステートで管理。
  - `isAuthenticated()` / `logout()` を利用し、未認証時には `/login` へリダイレクト。
  - 合計金額や承認待ち件数も UI 上部で表示。

Web アプリ全体として、マネージャー視点の承認フローに集中した単純な UI 構成になっており、E2E テストでは主に `login` → `dashboard` → 経費承認 → ログアウトまでの流れを検証します。

### Mobile App (`apps/mobile`)

Expo + React Native を用いたモバイルクライアントです（詳細は `apps/mobile/README.md`）。

- `App.tsx` で React Navigation のスタックナビゲーションを構成。
- `LoginScreen`, `HomeScreen` などのスクリーンコンポーネントを持ち、モバイルからの経費申請・ステータス確認を行います。
- `EXPO_PUBLIC_API_URL` を通じて Backend API との通信先を切り替えます（ローカル / Cloud Run 本番）。

## テスト戦略

### mabl

README に記載の通り、mabl では以下の高レベルシナリオをテストします:
1. API で `POST /api/reset` によりデータリセット
2. Mobile から Employee が経費申請（ステータス: PENDING）
3. Web で Manager が経費を APPROVED に変更
4. Mobile からステータス変更を確認

### Playwright (tests/web)

`tests/web` ディレクトリには、Manager の承認フローをブラウザ上で E2E テストするための Playwright セットアップがあります。

- テストファイル例: `manager-expense-approval.spec.ts`
  - ログインページ表示
  - Manager 認証情報でログイン
  - 経費リスト・対象レコード（Conference/5000/PENDING/employee）の検証
  - 承認操作とステータスの PENDING → APPROVED への変化確認
  - ログアウトまでを一連のフローとして検証
- `data-testid` 属性を Web アプリ側で定義しており、安定したセレクタとして利用
- `BASE_URL` 環境変数を切り替えることで、ローカルまたはデプロイ先に対してテスト実行可能

## デプロイ概要

詳細な手順は `docs/deployment-guide.md` にまとめられていますが、要点は以下の通りです。

- Google Cloud Run に Backend API (`expense-app-api`) と Web (`expense-app-web`) をそれぞれデプロイ。
- コンテナイメージは Artifact Registry (`expense-app` リポジトリ) に push。
- Cloud SQL (PostgreSQL) を `expense-db` として作成し、Secret Manager の `database-url` シークレット経由で `DATABASE_URL` を Cloud Run に注入。
- GitHub Actions (`.github/workflows/deploy-api.yml`, `deploy-web.yml`) が `main` への push をトリガーに CI/CD を実行し、自動デプロイと mabl テストの実行を行います。

本番環境の URL は `gcloud run services describe expense-app-api` / `expense-app-web` などで取得し、`EXPO_PUBLIC_API_URL` や `NEXT_PUBLIC_API_URL` に設定して、モバイル／Web から接続先を切り替えます。
