# Expense App 仕様書 (v2.0)

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
* **API認証:** ログイン時にダミートークンを発行、以降 `Authorization` ヘッダーでユーザーを識別する。

## 3. データモデル (Prisma Schema イメージ)
* **Expense**
    * `id`: Int (PK)
    * `title`: String
    * `amount`: Int
    * `status`: Enum (PENDING, APPROVED, REJECTED) - Default: PENDING
    * `applicantId`: String (申請者のusername)
    * `createdAt`: DateTime

## 4. API 仕様 (Port: 4000)
* `POST /api/reset`: DB全消去・初期化 (テスト用)
* `POST /api/expenses`: 申請作成 (Employeeのみ)
* `GET /api/expenses`: 一覧取得 (Managerは全件、Employeeは自分のみ)
* `PATCH /api/expenses/:id/status`: ステータス更新 (Managerのみ)
* **環境変数:** `CORS_ORIGIN` でWeb/Mobileからの接続を許可。

## 5. Web仕様 (Next.js / Port: 3000)
* **Login:** Manager用。
* **Dashboard:** 全申請リスト表示。承認ボタン (`approve-button-${id}`) でAPIを叩く。
* **環境変数:** `NEXT_PUBLIC_API_URL` (クライアント用), `INTERNAL_API_URL` (SSR用)

## 6. Mobile仕様 (Expo / React Native)
* **Login:** Employee用。
* **Home:** 自分の申請リスト。Pull to Refresh実装。申請フォーム。
* **TestID:** mabl用に `testID` と `accessibilityLabel` を主要要素に付与。
* **環境変数:** `EXPO_PUBLIC_API_URL` (ビルド時注入)

## 7. mablテストシナリオ
1. [API] `/api/reset` で初期化。
2. [Mobile] `employee` でログインし、5000円申請 -> `PENDING` 確認。
3. [Web] `manager` でログインし、該当申請を承認 -> `APPROVED` 確認。
4. [Mobile] リフレッシュし、ステータスが `APPROVED` に更新されたことを確認。