# mabl Test Creation Agent用プロンプト: Webテスト

以下のWebテストシナリオを作成してください。

## テスト対象アプリケーション

- **ベースURL**: `https://expense-app-web-xxxxx.vercel.app` または `http://localhost:3000`
- **Web仕様書**: 添付の `spec-expense-app.md` セクション5「Web仕様」を参照
- **対象フレームワーク**: Next.js (App Router)

## テストの前提条件

### 事前準備
1. APIサーバーが起動していること
2. `POST /api/reset` で初期化済みであること
3. Employee による経費申請が作成されていること（例: タイトル「Taxi」、金額「1500」）

## テストシナリオ: マネージャーによる経費承認フロー

### テストの目的
- Manager ユーザーがログインできること
- 全ての経費申請が一覧表示されること
- 特定の申請を承認でき、ステータスが「PENDING」から「APPROVED」に変わること

---

## テスト実行手順

### ステップ 1: ログインページへアクセス

**アクション**: ページナビゲーション
- **URL**: `{BASE_URL}/login`
- **検証項目**:
  - ページタイトルが「Login」を含むこと
  - ログインフォームが表示されていること

---

### ステップ 2: Manager 認証情報でログイン

**アクション**: ログインフォームに入力・送信

- **入力フィールド**:
  - Username: `manager`
  - Password: `manager123`

- **実行内容**:
  1. Username フィールド（`data-testid="username-input"`）に `manager` を入力
  2. Password フィールド（`data-testid="password-input"`）に `manager123` を入力
  3. ログインボタン（`data-testid="login-button"`）をクリック

- **期待される動作**:
  - ログインが成功すること
  - Dashboard ページにリダイレクトされること
  - URL が `/dashboard` になること

**検証項目**:
- ページが `/dashboard` にリダイレクトされていること
- Dashboard コンポーネント（`data-testid="dashboard"`）が表示されていること
- エラーメッセージが表示されていないこと

---

### ステップ 3: 経費申請一覧の確認

**アクション**: Dashboard ページで一覧を確認

- **検証項目**:
  - 一覧テーブル（`data-testid="expense-table"`）が表示されていること
  - ヘッダー行に以下のカラムが含まれていること:
    - ID
    - Title
    - Amount
    - Status
    - Applicant
    - Actions
  - 少なくとも 1 件以上の申請行が表示されていること

---

### ステップ 4: 「Taxi」申請を探す

**アクション**: 一覧から特定の申請を確認

- **検索条件**: タイトルが「Taxi」である行を特定
  - 行の `data-testid` は `expense-row-{id}` の形式
  - テーブル内で「Taxi」というテキストを探す

- **期待される行の内容**:
  - **Title**: "Taxi"
  - **Amount**: "1500"
  - **Status**: "PENDING" （ステータスが承認前であること）
  - **Applicant**: "employee"

- **検証項目**:
  - Taxi の申請行が表示されていること
  - ステータスが「PENDING」であること
  - 金額が 1500 であること

---

### ステップ 5: 承認ボタンをクリック

**アクション**: Taxi 申請の承認処理

- **対象ボタン**:
  - `data-testid="approve-button-{id}"` の形式
  - Taxi 申請に対応するボタン（例: `approve-button-1`）

- **実行内容**:
  1. 承認ボタンをクリック
  2. API リクエスト (`PATCH /api/expenses/{id}/status` with `{"status": "APPROVED"}`) が送信されるのを待つ

- **期待される動作**:
  - APIリクエストが成功すること（ステータスコード 200）
  - ページが自動的に更新されること、または一覧が再取得されること

**検証項目**:
- 承認ボタンがクリック可能であること
- ボタンクリック後、エラーが表示されていないこと

---

### ステップ 6: ステータスの更新確認

**アクション**: ページを更新し、Taxi のステータスが APPROVED に変わったことを確認

- **検証項目**:
  - Taxi の申請行が引き続き表示されていること
  - ステータスが「APPROVED」に変わっていること
  - 申請の詳細情報（Title, Amount, Applicant）は変更されていないこと

**補足**: ページの自動リロードが実装されている場合、リロード前に確認してください。手動でブラウザのリロード（F5 または Cmd+R）が必要な場合もあります。

---

### ステップ 7: ログアウト（オプション）

**アクション**: ログアウト機能の確認

- **実行内容**:
  1. ログアウトボタン（`data-testid="logout-button"`）をクリック
  2. ログインページにリダイレクトされることを確認

- **期待される動作**:
  - ユーザーセッションがクリアされること
  - URL が `/login` になること

**検証項目**:
- ログアウト後、Dashboard ページへのアクセスがリダイレクトされることを確認（推奨）

---

## 検証ポイント（データ検証）

以下の検証は各ステップ完了後に確認してください：

### ページ要素の検証

| 要素 | 期待値 | 検証方法 |
|------|--------|---------|
| ページタイトル | "Expense App" を含む | `title` 属性またはメタタグで確認 |
| ログインボタン | 有効状態 | `disabled` 属性が false であること |
| ダッシュボードテーブル | 少なくとも 1 行表示 | DOM に `expense-row-*` が存在 |
| 承認ボタン | クリック可能 | `disabled` 属性が false であること |
| ステータス表示 | 「PENDING」→「APPROVED」 | テキスト内容を比較 |

### API 連携の検証

- **ログイン時の API呼び出し**: ネットワークタブで確認
  - エンドポイント: `POST /api/expenses` または認証エンドポイント
  - リクエストヘッダー: `Authorization: manager`

- **承認時の API呼び出し**: ネットワークタブで確認
  - エンドポイント: `PATCH /api/expenses/{id}/status`
  - リクエストボディ: `{"status": "APPROVED"}`
  - レスポンス: HTTP 200 以上 299 未満

---

## 環境変数・設定

テスト実行環境での設定：

```bash
# .env.local または Vercel 環境変数
NEXT_PUBLIC_API_URL=https://expense-app-api-xxxxx.run.app
INTERNAL_API_URL=https://expense-app-api-xxxxx.run.app  # またはローカル: http://localhost:4000
```

---

## トラブルシューティング

### よくあるエラー

| エラー | 原因 | 対処法 |
|--------|------|--------|
| ログインボタンが無効状態 | 入力フィールドが空 | Username と Password を確認 |
| 承認ボタンが表示されない | Employee ロールでログイン | Manager ロール (`manager`/`manager123`) でログインしてください |
| ステータスが更新されない | API がエラーを返している | ネットワークタブで API レスポンスを確認 |
| 「Taxi」が見つからない | API リセット未実行 | 事前条件として `/api/reset` を実行してください |
| CORS エラー | `CORS_ORIGIN` 未設定 | APIサーバーの環境変数 `CORS_ORIGIN` を確認 |

---

## 参考資料

- **API テスト**: `/docs/prompts/11-api-test.md`
- **Web 仕様**: `/docs/prompts/02-web.md`
- **総仕様書**: `/docs/spec-expense-app.md`
- **mabl 生成指示**: `/docs/prompts/04-mabl-generation.md`
