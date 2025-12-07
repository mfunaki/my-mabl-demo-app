# デプロイ先URL一覧

このドキュメントには、デプロイ済みのサービスURLを記載します。

## 本番環境

### Backend API
- URL: https://expense-app-api-ixi7x7b23a-an.a.run.app
- リージョン: asia-northeast1
- プラットフォーム: Google Cloud Run

### Web Frontend
- URL: (以下のコマンドで確認)
- リージョン: asia-northeast1
- プラットフォーム: Google Cloud Run

```bash
gcloud run services describe expense-app-web \
  --region=asia-northeast1 \
  --format='value(status.url)'
```

### Mobile App
- プラットフォーム: Expo (Android APK)
- ビルド先: https://expo.dev/accounts/YOUR_USERNAME/projects/expense-mobile/builds
- 接続先API: Backend API (上記URL)

---

## ローカル開発環境

### Backend API
- URL: http://localhost:4000

### Web Frontend
- URL: http://localhost:3000

### Mobile App
- iOS Simulator: http://localhost:4000
- Android Emulator: http://10.0.2.2:4000

---

## 認証情報

### Manager (Web)
- Username: `manager`
- Password: `manager123`

### Employee (Mobile)
- Username: `employee`
- Password: `employee123`

---

## API動作確認

```bash
# Backend API URL
API_URL="https://expense-app-api-ixi7x7b23a-an.a.run.app"

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
