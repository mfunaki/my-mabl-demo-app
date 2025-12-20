# デプロイガイド

## 前提条件

- Google Cloud プロジェクト
- GitHub リポジトリ
- gcloud CLI のインストール

## 1. Google Cloud セットアップ

### 1.1 プロジェクト作成と設定

```bash
# プロジェクト作成
gcloud projects create YOUR_PROJECT_ID
gcloud config set project YOUR_PROJECT_ID

# 課金アカウントの設定
gcloud beta billing projects link YOUR_PROJECT_ID \
  --billing-account=BILLING_ACCOUNT_ID
```

### 1.2 必要なAPIの有効化

```bash
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable iam.googleapis.com
gcloud services enable iamcredentials.googleapis.com

# APIの有効化には数分かかる場合があります
echo "Waiting for APIs to be enabled..."
sleep 30
```

### 1.3 Artifact Registry リポジトリの作成

```bash
gcloud artifacts repositories create expense-app \
  --repository-format=docker \
  --location=asia-northeast1 \
  --description="Expense app container images"
```

### 1.4 Cloud SQL インスタンスの作成

```bash
# PostgreSQLインスタンスの作成
gcloud sql instances create expense-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-northeast1 \
  --root-password=CHOOSE_A_STRONG_PASSWORD

# データベースの作成
gcloud sql databases create expense_db --instance=expense-db

# ユーザーの作成
gcloud sql users create expense_user \
  --instance=expense-db \
  --password=CHOOSE_A_STRONG_PASSWORD

# 接続名の確認
gcloud sql instances describe expense-db --format="value(connectionName)"
```

### 1.5 Secret Manager でシークレットを作成

**注意:** Secret Manager APIが有効化されていることを確認してください。

```bash
# Secret Manager APIの有効化確認
gcloud services list --enabled --filter="name:secretmanager.googleapis.com"

# DATABASE_URLの作成
echo -n "postgresql://expense_user:PASSWORD@/expense_db?host=/cloudsql/PROJECT_ID:asia-northeast1:expense-db" | \
  gcloud secrets create database-url --data-file=-

# Secret ManagerへのアクセスをCloud Runに許可
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)")
gcloud secrets add-iam-policy-binding database-url \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

**トラブルシューティング:**

もしAPIが有効化されていない場合:
```bash
gcloud services enable secretmanager.googleapis.com
# 有効化完了まで30秒〜数分待つ
sleep 60
```

## 2. Workload Identity Federation のセットアップ

```bash
# Workload Identity Pool の作成
gcloud iam workload-identity-pools create "github-pool" \
  --location="global" \
  --display-name="GitHub Actions Pool"

# OIDC Provider の作成
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
  --attribute-condition="assertion.repository_owner == 'YOUR_GITHUB_USER'" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# サービスアカウントの作成
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Service Account"

# 権限の付与
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Workload Identity のバインディング
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)")

gcloud iam service-accounts add-iam-policy-binding \
  github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/attribute.repository/YOUR_GITHUB_USER/my-mabl-demo-app"
```

**重要:** `YOUR_GITHUB_USER` を実際のGitHubユーザー名またはOrganization名に置き換えてください。

## 3. GitHub Secrets の設定

GitHubリポジトリの **Settings → Secrets and variables → Actions → Repository secrets** で以下を設定:

**New repository secret** ボタンをクリックして、以下の5つのsecretsを追加してください。

### 必須のSecrets (Repository secrets)

| Secret名 | 値 | 説明 |
|---------|-----|------|
| `GCP_PROJECT_ID` | `YOUR_PROJECT_ID` | Google CloudプロジェクトID |
| `WIF_PROVIDER` | `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider` | Workload Identity Provider |
| `WIF_SERVICE_ACCOUNT` | `github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com` | サービスアカウント |
| `CLOUD_SQL_CONNECTION_NAME` | `PROJECT_ID:asia-northeast1:expense-db` | Cloud SQL接続名 |
| `CORS_ORIGIN` | `https://your-frontend-domain.com` または `*` (開発時) | フロントエンドのURL |

### WIF_PROVIDER の取得方法

```bash
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)")
echo "projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/providers/github-provider"
```

**注意:** Environment secretsは使用しません。すべて Repository secrets として設定してください。

## 4. 初回デプロイ

### 4.1 コードをプッシュ

```bash
git add .
git commit -m "Setup Cloud Run deployment"
git push origin main
```

### 4.2 デプロイの確認

GitHub Actionsのワークフローが自動実行されます。

進行状況: **Actions** タブで確認

### 4.3 サービスURLの確認

```bash
gcloud run services describe expense-app-api \
  --platform managed \
  --region asia-northeast1 \
  --format 'value(status.url)'
```

### 4.4 CIでのAPIテスト (mabl)

- ワークフロー `.github/workflows/deploy-api.yml` はデプロイ成功後に mabl CLI（`npm install -g @mablhq/mabl-cli`）をインストールし、`mabl tests run --id ykrgAm2iDrn2sTYoH3Xm3Q-j --reporter mabl` を実行してAPIを検証します（`--reporter mabl` を指定すると結果がmablアプリに公開されます）。
- 必須シークレット: `MABL_API_KEY` (リポジトリ secrets) を設定してください。
- mabl 側のテストIDを変更する場合はワークフロー内の `mabl tests run --id ...` を更新してください。
- テスト失敗時はジョブが失敗するので、Actions タブでログを確認し、必要に応じてリトライしてください。

## 5. 本番環境の確認

```bash
# サービスURL取得
SERVICE_URL=$(gcloud run services describe expense-app-api \
  --platform managed \
  --region asia-northeast1 \
  --format 'value(status.url)')

# APIテスト
curl ${SERVICE_URL}/api/reset -X POST
curl ${SERVICE_URL}/api/expenses -H "Authorization: employee"
```

## 6. トラブルシューティング

### ログの確認

```bash
gcloud run services logs read expense-app-api \
  --region=asia-northeast1 \
  --limit=50
```

### Cloud SQL接続の確認

```bash
gcloud sql instances describe expense-db
```

### Secret Managerの確認

```bash
gcloud secrets versions access latest --secret=database-url
```

## 7. セキュリティのベストプラクティス

- ✅ 環境変数ファイル(`.env`)をGitに含めない
- ✅ Secret Managerでクレデンシャルを管理
- ✅ Workload Identity Federationで認証
- ✅ Cloud SQLへのアクセスはプライベート接続
- ✅ CORS設定で許可するオリジンを制限

## 8. コスト最適化

```bash
# 最小インスタンス数を0に設定（アイドル時は課金なし）
gcloud run services update expense-app-api \
  --min-instances=0 \
  --region=asia-northeast1

# Cloud SQLの自動バックアップ無効化（開発環境）
gcloud sql instances patch expense-db \
  --no-backup
```

## 9. フロントエンドのデプロイ（Vercel推奨）

```bash
# Vercelにデプロイ
cd apps/web
vercel --prod

# 環境変数の設定
vercel env add NEXT_PUBLIC_API_URL production
# 値: https://YOUR-CLOUD-RUN-URL
```

## 10. モバイルアプリの設定更新

```bash
# apps/mobile/.env
EXPO_PUBLIC_API_URL=https://YOUR-CLOUD-RUN-URL
```

---

**次のステップ:**
- カスタムドメインの設定
- Cloud CDNの有効化
- モニタリングとアラートの設定
