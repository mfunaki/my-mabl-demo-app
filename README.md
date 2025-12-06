# Expense App - mabl Demo Application

社員がモバイルアプリから経費を申請し、上司（管理者）がWeb管理画面で承認を行うデモ用アプリケーション。

## 🚀 デプロイ先

Google Cloud Runにデプロイすると、以下の形式のURLが自動生成されます:

- **Backend API**: `https://expense-app-api-XXXXX-an.a.run.app`
- **Web Frontend**: `https://expense-app-web-XXXXX-an.a.run.app`
- **Mobile App**: Expo Go (開発環境) / EAS Build (本番環境)

> **Note**: `XXXXX`の部分はCloud Runが自動生成するランダムな文字列です。
> デプロイ後、以下のコマンドでURLを確認できます:
> ```bash
> gcloud run services describe expense-app-api --region=asia-northeast1 --format='value(status.url)'
> gcloud run services describe expense-app-web --region=asia-northeast1 --format='value(status.url)'
> ```

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
- PostgreSQL (Cloud SQL)
- Docker + Google Cloud Run
- GitHub Actions (CI/CD)

### Web Frontend
- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Docker + Google Cloud Run
- GitHub Actions (CI/CD)

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

## 本番環境の使用方法

### 1. デプロイ先URLの確認

```bash
# Backend API URL
API_URL=$(gcloud run services describe expense-app-api \
  --region=asia-northeast1 \
  --format='value(status.url)')
echo "Backend API: $API_URL"

# Web Frontend URL
WEB_URL=$(gcloud run services describe expense-app-web \
  --region=asia-northeast1 \
  --format='value(status.url)')
echo "Web Frontend: $WEB_URL"
```

### 2. Web管理画面
1. 上記で確認したWeb Frontend URLにアクセス
2. Manager認証情報でログイン:
   - ユーザー名: `manager`
   - パスワード: `manager123`
3. 経費一覧の確認と承認

### 3. モバイルアプリ
1. Expo Goアプリをインストール
2. `apps/mobile/.env`に本番APIのURLを設定:
   ```env
   EXPO_PUBLIC_API_URL=https://expense-app-api-XXXXX-an.a.run.app
   ```
3. Employee認証情報でログイン:
   - ユーザー名: `employee`
   - パスワード: `employee123`
4. 経費申請とステータス確認

### 4. API直接アクセス
```bash
# デプロイ先URLを環境変数に設定
API_URL=$(gcloud run services describe expense-app-api \
  --region=asia-northeast1 \
  --format='value(status.url)')

# データリセット
curl -X POST ${API_URL}/api/reset

# 経費作成
curl -X POST ${API_URL}/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: employee" \
  -d '{"title":"Conference","amount":5000}'

# 経費一覧取得
curl -H "Authorization: manager" ${API_URL}/api/expenses
```

## デプロイ

### Backend API → Cloud Run
```bash
# apps/api配下のファイルを更新してpush
git add apps/api
git commit -m "Update API"
git push origin main
```

### Web Frontend → Cloud Run
```bash
# apps/web配下のファイルを更新してpush
git add apps/web
git commit -m "Update Web"
git push origin main
```

### 手動デプロイ
詳細は [デプロイガイド](./docs/deployment-guide.md) を参照してください。

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
│   ├── api/              # Backend API (Cloud Run)
│   ├── web/              # Web Frontend (Cloud Run)
│   └── mobile/           # Mobile App (Expo)
├── docs/                 # ドキュメント
│   ├── deployment-guide.md
│   ├── github-secrets-setup.md
│   └── prompts/
├── scripts/              # テストスクリプト
│   └── test-api.sh
├── .github/
│   └── workflows/        # CI/CD
│       ├── deploy-api.yml
│       └── deploy-web.yml
└── docker-compose.yml    # ローカル開発環境
```

## 開発ワークフロー

1. ローカルで開発・テスト (Docker Compose)
2. mainブランチにpush
3. GitHub Actionsが自動デプロイ
4. Cloud Run上で動作確認

## モニタリング

### Cloud Runログ
```bash
# API
gcloud run services logs read expense-app-api \
  --region=asia-northeast1 \
  --project=mabl-457308 \
  --limit=50

# Web
gcloud run services logs read expense-app-web \
  --region=asia-northeast1 \
  --project=mabl-457308 \
  --limit=50
```

### Cloud SQLログ
```bash
gcloud sql operations list --instance=expense-db
```

## ライセンス

MIT
