# Expense App 仕様書 (v2.1)

## 1. アプリケーション概要
社員がモバイルアプリから経費を申請し、上司（管理者）がWeb管理画面で承認を行うデモ用アプリケーション。
mablによるクロスプラットフォームテスト（Mobile ⇄ API ⇄ Web）の実証を主目的とする。

### アクター
* **Employee (一般社員):** モバイルアプリを使用。自身の申請作成・閲覧のみ可能。
* **Manager (上司/管理者):** Webアプリを使用。全社員の申請閲覧・承認が可能。

## 2. 認証仕様
デモ用のためハードコード認証とする。
* **Employee:** `employee` / `employee123`
* **Manager:** `manager` / `manager123`
* **パスワード規則:** `{username}123` 形式（任意のユーザー名に対応）
* **API認証:** ユーザー名を `Authorization` ヘッダーに直接設定する簡易実装。トークン発行は行わない。
* **クライアント認証:** Web は localStorage、Mobile は AsyncStorage にユーザー名を保存。

## 3. データモデル
### Prisma Schema（スキーマ定義用）
```prisma
model Expense {
  id          Int           @id @default(autoincrement())
  title       String
  amount      Int
  status      ExpenseStatus @default(PENDING)
  applicantId String        @map("applicant_id")
  createdAt   DateTime      @default(now()) @map("created_at")
  @@map("expenses")
}

enum ExpenseStatus {
  PENDING
  APPROVED
  REJECTED
}
```

**注意:** ランタイムでは Prisma Client を使用せず、`pg` パッケージによる raw SQL でデータベース操作を行う。

## 4. API 仕様 (Port: 4000)
### エンドポイント
| メソッド | パス | 説明 | 権限 |
|---------|------|------|------|
| `POST` | `/api/reset` | DB全消去・シーケンスリセット (テスト用) | なし |
| `POST` | `/api/migrate` | テーブル作成 (レガシー、起動時に自動実行) | なし |
| `GET` | `/api/expenses` | 一覧取得 | Manager: 全件、Employee: 自分のみ |
| `POST` | `/api/expenses` | 申請作成 | Employee のみ |
| `PATCH` | `/api/expenses/:id/status` | ステータス更新 (APPROVED/REJECTED) | Manager のみ |

### 環境変数
* `DATABASE_URL`: PostgreSQL接続文字列（必須）
* `CORS_ORIGIN`: 許可するオリジン（デフォルト: `http://localhost:3000`）
* `PORT`: サーバーポート（デフォルト: Cloud Run では 8080、ローカルでは 4000）

## 5. Web仕様 (Next.js / Port: 3000)
* **Login (`/login`):** Manager用ログイン画面。
* **Dashboard (`/dashboard`):** 全申請リスト表示。承認・ログアウト・全データ削除機能。
* **テスト属性:** 詳細は `/docs/prompts/02-web.md` を参照。主要な `data-testid`:
  * `approve-button-${id}`: 承認ボタン
  * `expense-row-${id}`: 経費行
  * `logout-button`: ログアウトボタン
  * `reset-button`: 全データ削除ボタン
* **環境変数:** `NEXT_PUBLIC_API_URL` (クライアント用), `INTERNAL_API_URL` (SSR用)

## 6. Mobile仕様 (Expo / React Native)
* **ナビゲーション:** React Navigation (`@react-navigation/native-stack`) を使用。
* **Login:** Employee用ログイン画面。
* **Home:** 自分の申請リスト。Pull to Refresh実装。申請フォーム。ログアウト機能。
* **テスト属性:** 詳細は `/docs/prompts/03-mobile.md` を参照。主要な testID/accessibilityLabel:
  * `expense-item-${title}`: 経費アイテム
  * `submit-button`: 申請ボタン
  * `logout-button`: ログアウトボタン
* **環境変数:** `app.config.ts` で `EXPO_PUBLIC_API_URL` を `extra.apiUrl` に設定。ランタイムでは `Constants.expoConfig?.extra?.apiUrl` で取得。

## 7. mablテストシナリオ
1. [API] `/api/reset` で初期化。
2. [Mobile] `employee` でログインし、経費申請（Taxi / 1500） -> `PENDING` 確認。
3. [Web] `manager` でログインし、以下を確認・実行：
   - 経費の表示件数と合計金額をチェック（生成AIアサーション）
   - 個々の申請の内容（タイトル、金額、申請者、ステータス）を確認
   - 該当申請を承認 -> `APPROVED` 確認。
4. [Mobile] Pull to Refresh し、ステータスが `APPROVED` に更新されたことを確認。

### テスト出力言語
mablテスト仕様書は**日本語**で出力すること。

## 8. 関連ドキュメント
* `/docs/prompts/01-api.md`: API実装プロンプト
* `/docs/prompts/02-web.md`: Web実装プロンプト
* `/docs/prompts/03-mobile.md`: Mobile実装プロンプト
* `/CLAUDE.md`: 開発ガイドライン