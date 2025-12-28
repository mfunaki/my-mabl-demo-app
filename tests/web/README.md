# Web Application Tests

Playwrightを使用したExpense Appのエンドツーエンド(E2E)テストです。

## テスト概要

マネージャーが経費申請を承認するワークフロー全体をテストするテストスイートです。

### テストファイル

- **manager-expense-approval.spec.ts**: マネージャーの経費承認フロー全体をテストします

## 前提条件

1. Node.js (v16以上)
2. 以下のサービスが起動していること:
   - Web アプリケーション (`http://localhost:3000`)
   - API サーバー (`http://localhost:4000`)

## セットアップ

### 1. 依存パッケージのインストール

```bash
cd tests/web
npm install
```

### 2. Playwrightブラウザのインストール

```bash
npx playwright install
```

## テスト実行

### 基本的なテスト実行

```bash
npm test
```

### UIモードでテスト実行（推奨）

```bash
npm run test:ui
```

### デバッグモード実行

```bash
npm run test:debug
```

### ブラウザウィンドウを表示して実行

```bash
npm run test:headed
```

### 特定のブラウザでテスト実行

```bash
npm run test:chromium   # Chromium
npm run test:firefox    # Firefox
npm run test:webkit     # WebKit
```

### 特定のテストのみ実行

```bash
npx playwright test manager-expense-approval
npx playwright test --grep "Step 1"
```

### テストレポートの表示

```bash
npm run test:report
```

## テスト構成

### テストスイート: Manager Expense Approval Flow

#### 前提条件（beforeEach）

各テスト実行前に以下の処理を実行します:
1. APIをリセット (`POST /api/reset`)
2. テスト用の経費申請を作成（Employee が「Conference」という経費を5000で申請）

#### 個別テスト

1. **Step 1: Access login page**
   - ログインページへのアクセスを確認
   - ページタイトルとログインフォームの表示を検証

2. **Step 2: Manager authentication and login**
   - Manager 認証情報でログイン
   - ダッシュボードへのリダイレクトを確認
   - エラーメッセージがないことを検証

3. **Step 3: Verify expense list**
   - 経費テーブルの表示を確認
   - テーブルヘッダーが正しく表示されていることを検証
   - 少なくとも1件の経費行があることを確認

4. **Step 4: Find Conference expense**
   - 「Conference」という経費を探す
   - 金額（5000）、ステータス（PENDING）、申請者（employee）を検証

5. **Step 5 & 6: Approve Conference expense and verify status change**
   - 承認ボタンをクリック
   - ステータスが「PENDING」から「APPROVED」に変わることを検証
   - その他の詳細情報が変わらないことを確認

6. **Step 7: Logout functionality**
   - ログアウト機能を確認
   - ログインページへのリダイレクトを検証

7. **Complete Manager Approval Workflow**
   - 全ステップを統合したエンドツーエンドテスト

## 環境変数

### Playwright設定で使用可能な環境変数

```bash
BASE_URL=http://localhost:3000     # テスト対象のベースURL
CI=false                            # CI環境フラグ
```

### テスト実行時の環境設定例

```bash
BASE_URL=http://localhost:3000 npm test
```

## トラブルシューティング

### ブラウザが起動しない場合

```bash
npx playwright install
npx playwright install-deps
```

### APIへの接続エラーが出る場合

APIサーバーが `http://localhost:4000` で起動していることを確認:

```bash
# プロジェクトルートで
npm run start:api
```

### ログインページが表示されない場合

Webアプリケーションが `http://localhost:3000` で起動していることを確認:

```bash
# プロジェクトルートで
cd apps/web
npm run dev
```

### テストがタイムアウトする場合

- `playwright.config.ts` の `timeout` を増やす
- 各テストの待機時間を調整

```bash
npm test -- --timeout=60000  # 60秒のタイムアウト設定
```

## テスト要素のセレクタ

テストで使用されているdata-testid属性:

| 要素 | data-testid |
|------|------------|
| Username入力フィールド | `username-input` |
| Password入力フィールド | `password-input` |
| ログインボタン | `login-button` |
| ログインフォーム | `login-form` |
| ダッシュボード | `dashboard` |
| 経費テーブル | `expense-table` |
| 経費行 | `expense-row-{id}` |
| 承認ボタン | `approve-button-{id}` |
| ログアウトボタン | `logout-button` |

## CI/CD統合

### GitHub Actionsでの実行例

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      api:
        image: your-api-image
        ports:
          - 4000:4000
      
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: |
          cd tests/web
          npm install
          npx playwright install
      
      - name: Run tests
        run: cd tests/web && npm test
      
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: tests/web/playwright-report/
```

## 参考資料

- [Playwright 公式ドキュメント](https://playwright.dev/)
- [テスト仕様書](../docs/spec-expense-app.md)
- [Webテスト要件](../docs/prompts/12-web-test.md)
