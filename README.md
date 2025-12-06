# Expense App - mabl Demo Application

社員がモバイルアプリから経費を申請し、上司（管理者）がWeb管理画面で承認を行うデモ用アプリケーション。

## アーキテクチャ

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Mobile    │─────▶│   Backend   │─────▶│  PostgreSQL  │
│   (Expo)    │      │   (API)     │      │              │
└─────────────┘      └─────────────┘      └──────────────┘
                            ▲
                            │
                     ┌─────────────┐
                     │     Web     │
                     │  (Next.js)  │
                     └─────────────┘
```

## Tech Stack

### Backend API
- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- Docker + Cloud Run

### Web Frontend
- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Vercel

### Mobile App
- Expo + React Native
- TypeScript
- Expo Go

## ローカル開発環境のセットアップ

### 前提条件
- Node.js 18+
- Docker Desktop
- Git

### 1. リポジトリのクローン

```bash
git clone https://github.com/YOUR_USER/my-mabl-demo-app.git
cd my-mabl-demo-app
```

### 2. Docker Composeで起動

```bash
docker-compose up -d
```

以下のサービスが起動します:
- PostgreSQL: `localhost:5432`
- Backend API: `localhost:4000`
- Web Frontend: `localhost:3000`

### 3. または個別に起動

#### Backend API
```bash
cd apps/api
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

#### Web Frontend
```bash
cd apps/web
npm install
npm run dev
```

#### Mobile App
```bash
cd apps/mobile
npm install
npx expo start
```

## 認証情報

### Manager (Web)
- ユーザー名: `manager`
- パスワード: `manager123`

### Employee (Mobile)
- ユーザー名: `employee`
- パスワード: `employee123`

## API エンドポイント

- `POST /api/reset` - データリセット
- `GET /api/expenses` - 経費一覧取得
- `POST /api/expenses` - 経費作成
- `PATCH /api/expenses/:id/status` - ステータス更新

## デプロイ

詳細は [デプロイガイド](./docs/deployment-guide.md) を参照してください。

### クイックデプロイ

```bash
# Backend API → Cloud Run
git push origin main

# Web → Vercel
cd apps/web
vercel --prod
```

## テスト (mabl)

mablでのテストシナリオ:
1. [API] データリセット
2. [Mobile] 経費申請 (PENDING)
3. [Web] 承認処理 (APPROVED)
4. [Mobile] ステータス確認

## プロジェクト構成

```
my-mabl-demo-app/
├── apps/
│   ├── api/           # Backend API
│   ├── web/           # Web Frontend
│   └── mobile/        # Mobile App
├── docs/              # ドキュメント
├── .github/
│   └── workflows/     # CI/CD
└── docker-compose.yml
```

## ライセンス

MIT
