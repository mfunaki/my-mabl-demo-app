# Simple Expense App 仕様書

## 1. アプリケーション概要
社員がモバイルアプリから経費を申請し、管理者がWeb管理画面で承認を行うデモ用アプリケーション。
mablによるクロスプラットフォームテスト（Mobile ⇄ API ⇄ Web）の実証を主目的とする。

### アクター
* **Employee (社員):** モバイルアプリを使用。経費の申請とステータス確認を行う。
* **Admin (管理者):** Webアプリを使用。全社員の申請一覧確認と承認/却下を行う。

---

## 2. 認証仕様 (Authentication)
デモの安定性を優先し、簡易的なハードコード認証とする。

* **Username:** `demo-user`
* **Password:** `password123`
* **挙動:**
    * 正しいID/PASSの場合: ログイン成功（トークン等はダミーで可、localStorage等にフラグ保持）
    * 誤ったID/PASSの場合: エラーメッセージを表示

---

## 3. データモデル (Schema)
バックエンド（Prisma/PostgreSQL想定）で管理するデータ構造。

### `Expense` テーブル
| カラム名 | 型 | 説明 |
| :--- | :--- | :--- |
| `id` | Integer (Auto Increment) | 一意なID。テストでの特定に使用。 |
| `title` | String | 経費の用途（例: "タクシー代"）。 |
| `amount` | Integer | 金額。 |
| `status` | Enum | `PENDING` (申請中), `APPROVED` (承認済), `REJECTED` (却下)。初期値は `PENDING`。 |
| `createdAt` | DateTime | 申請日時。 |

---

## 4. API 仕様 (Backend)
RESTful API エンドポイント。ポート `4000` で動作。

### `GET /api/expenses`
* **概要:** 経費一覧の取得。
* **Response:** `Expense[]` (JSON)

### `POST /api/expenses`
* **概要:** 経費の新規申請。
* **Request Body:** `{ "title": "...", "amount": 5000 }`
* **Response:** 作成された `Expense` オブジェクト (IDを含む)

### `PATCH /api/expenses/:id/status`
* **概要:** ステータスの更新（承認/却下）。
* **Request Body:** `{ "status": "APPROVED" }`
* **Response:** 更新された `Expense` オブジェクト

---

## 5. Webアプリケーション仕様 (Frontend - Next.js)
ポート `3000` で動作。

### 5.1 共通要件
* **テスト容易性:** 重要な操作要素には必ず `data-testid` 属性を付与すること。

### 5.2 ログイン画面 (`/login`)
* **UI要素:**
    * ユーザー名入力欄: `data-testid="username-input"`
    * パスワード入力欄: `data-testid="password-input"`
    * ログインボタン: `data-testid="login-button"`
    * エラーメッセージ: `data-testid="error-message"`

### 5.3 ダッシュボード画面 (`/dashboard`)
* **機能:** 経費一覧の表示と承認操作。
* **UI要素:**
    * ログアウトボタン: `data-testid="logout-button"`
    * **経費リストテーブル:**
        * 各行 (`tr`) には、経費IDを含んだ属性 `data-testid="expense-row-${expense.id}"` を付与すること。
        * 例: IDが101の場合 -> `data-testid="expense-row-101"`
    * **承認ボタン:**
        * 各行の中に配置。`data-testid="approve-button-${expense.id}"`
        * 押下後、即座にAPIを叩き、UI上のステータスを「承認済」に更新すること。
    * **ステータス表示テキスト:**
        * 各行の中に配置。`data-testid="status-text-${expense.id}"`

---

## 6. Mobileアプリケーション仕様 (React Native - Expo)
`testID` 属性を使用し、mabl (Appiumベース) から要素を特定可能にすること。

### 6.1 ログイン画面
* **UI要素:**
    * ユーザー名入力: `testID="username-input"`
    * パスワード入力: `testID="password-input"`
    * ログインボタン: `testID="login-button"`

### 6.2 経費申請画面 (Home)
* **機能:**
    1.  **申請フォーム:** タイトルと金額を入力して送信。
    2.  **申請履歴リスト:** 自分の申請ステータスを表示。
    3.  **リフレッシュ:** リストを下に引っ張って更新 (Pull to Refresh) できること。
* **UI要素:**
    * タイトル入力欄: `testID="title-input"`
    * 金額入力欄: `testID="amount-input"`
    * 申請ボタン: `testID="submit-button"`
    * **履歴リストアイテム:**
        * 各アイテムのコンテナに `testID="expense-item-${expense.title}"` を付与（※デモ簡易化のためタイトルまたはIDで特定）。
    * **ステータス表示:**
        * 各アイテム内に `testID="expense-status-${expense.title}"` を配置。

---

## 7. デモシナリオ (mabl Test Plan)

この仕様に基づき、以下のE2Eテストフローを実施する。

1.  **[Mobile]** ユーザーがログインし、「接待費」5000円を申請する。
2.  **[Mobile]** 申請直後のステータスが `PENDING` であることを確認する。
    * *mablで生成されたIDを変数 `target_expense_id` として保存*
3.  **[API]** mablから直接 `GET /api/expenses` を叩き、DBにデータが登録されていることを検証する。
4.  **[Web]** 管理者がログインする。
5.  **[Web]** ダッシュボードで `data-testid="expense-row-${target_expense_id}"` を探す。
6.  **[Web]** 該当行の `approve-button` をクリックする。
7.  **[Web]** ステータスが `APPROVED` に変わったことを確認する。
8.  **[Mobile]** アプリ画面をリフレッシュする。
9.  **[Mobile]** 「接待費」のステータスが `APPROVED` に変化していることを確認する。