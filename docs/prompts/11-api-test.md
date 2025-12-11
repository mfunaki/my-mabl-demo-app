# mabl Test Creation Agent用プロンプト: APIテスト

以下のAPIテストシナリオを作成してください。

## テスト対象API

- **ベースURL**: `https://expense-app-api-ixi7x7b23a-an.a.run.app`
- **API仕様書**: 添付の `expense-api.yml` を参照

## テストシナリオ: 経費申請の作成から承認までの一連の流れ

### テストの目的
経費精算アプリケーションのAPIが正しく動作することを確認します。以下の一連の操作をテストします：
1. データのリセット
2. 空の状態の確認
3. 経費申請の作成
4. 一覧取得と権限の確認
5. ステータスの更新（承認）
6. 最終状態の確認

### 実行手順

#### 1. データリセット

**エンドポイント**: `POST /api/reset`

- **期待結果**:
  - ステータスコード: `200`
  - レスポンスボディ: `{"message": "All expenses deleted"}`

**検証項目**:
- レスポンスのステータスコードが200であること
- メッセージが "All expenses deleted" であること

---

#### 2. 空の経費一覧を確認（employee）

**エンドポイント**: `GET /api/expenses`

- **リクエストヘッダー**:
  - `Authorization: employee`
- **期待結果**:
  - ステータスコード: `200`
  - レスポンスボディ: `[]` (空の配列)

**検証項目**:
- レスポンスのステータスコードが200であること
- レスポンスボディが空の配列であること:
  - アサーション:
    - Target: JSON body
    - JSON Path: `$[0]`
    - Assertion: Does not exist
    - 意味: 1番目の要素が存在しないこと（配列が空）

---

#### 3. 経費申請を作成（1件目: Conference）

**エンドポイント**: `POST /api/expenses`

- **リクエストヘッダー**:
  - `Authorization: employee`
  - `Content-Type: application/json`
- **リクエストボディ**:
  ```json
  {
    "title": "Conference",
    "amount": 5000
  }
  ```
- **期待結果**:
  - ステータスコード: `201`
  - レスポンスボディに以下が含まれること:
    - `id`: 1
    - `title`: "Conference"
    - `amount`: 5000
    - `status`: "PENDING"
    - `applicantId`: "employee"

**検証項目**:
- レスポンスのステータスコードが201であること
- IDが1であること
- タイトルが "Conference" であること
- 金額が 5000 であること
- ステータスが "PENDING" であること
- 申請者IDが "employee" であること

**変数保存**:
- レスポンスの `id` フィールドの値を変数 `expenseId1` として保存してください
  - 例: `expenseId1 = response.id` (値は 1 になるはず)

---

#### 4. 経費申請を作成（2件目: Taxi）

**エンドポイント**: `POST /api/expenses`

- **リクエストヘッダー**:
  - `Authorization: employee`
  - `Content-Type: application/json`
- **リクエストボディ**:
  ```json
  {
    "title": "Taxi",
    "amount": 1500
  }
  ```
- **期待結果**:
  - ステータスコード: `201`
  - レスポンスボディに以下が含まれること:
    - `id`: 2
    - `title`: "Taxi"
    - `amount`: 1500
    - `status`: "PENDING"
    - `applicantId`: "employee"

**検証項目**:
- レスポンスのステータスコードが201であること
- IDが2であること
- タイトルが "Taxi" であること
- 金額が 1500 であること
- ステータスが "PENDING" であること

**変数保存**:
- レスポンスの `id` フィールドの値を変数 `expenseId2` として保存してください
  - 例: `expenseId2 = response.id` (値は 2 になるはず)

---

#### 5. 経費一覧を取得（employee視点）

**エンドポイント**: `GET /api/expenses`

- **リクエストヘッダー**:
  - `Authorization: employee`
- **期待結果**:
  - ステータスコード: `200`
  - レスポンスボディに2件の経費が含まれること
  - 両方の `applicantId` が "employee" であること

**検証項目**:
- レスポンスのステータスコードが200であること
- 配列の長さが2であること:
  - アサーション1:
    - Target: JSON body
    - JSON Path: `$[1]`
    - Assertion: Exists
    - 意味: 2番目の要素が存在すること
  - アサーション2:
    - Target: JSON body
    - JSON Path: `$[2]`
    - Assertion: Does not exist
    - 意味: 3番目の要素が存在しないこと（配列の要素数が2）
- 全ての経費の申請者が "employee" であること

---

#### 6. 経費一覧を取得（manager視点）

**エンドポイント**: `GET /api/expenses`

- **リクエストヘッダー**:
  - `Authorization: manager`
- **期待結果**:
  - ステータスコード: `200`
  - レスポンスボディに2件の経費が含まれること
  - manager は全ての経費を参照できること

**検証項目**:
- レスポンスのステータスコードが200であること
- 配列の長さが2であること:
  - アサーション1:
    - Target: JSON body
    - JSON Path: `$[1]`
    - Assertion: Exists
    - 意味: 2番目の要素が存在すること
  - アサーション2:
    - Target: JSON body
    - JSON Path: `$[2]`
    - Assertion: Does not exist
    - 意味: 3番目の要素が存在しないこと（配列の要素数が2）
- (manager は権限によりemployeeの経費も参照できる)

---

#### 7. 経費申請を承認（ID: expenseId1）

**エンドポイント**: `PATCH /api/expenses/{expenseId1}/status`

**注意**: URLの `{expenseId1}` 部分は、テスト3で保存した変数 `expenseId1` の値に置き換えてください

- **リクエストヘッダー**:
  - `Authorization: manager`
  - `Content-Type: application/json`
- **リクエストボディ**:
  ```json
  {
    "status": "APPROVED"
  }
  ```
- **期待結果**:
  - ステータスコード: `200`
  - レスポンスボディに以下が含まれること:
    - `id`: `expenseId1` の値と一致
    - `status`: "APPROVED"

**検証項目**:
- レスポンスのステータスコードが200であること
- レスポンスの `id` が変数 `expenseId1` の値と一致すること
- ステータスが "APPROVED" に変更されていること

---

#### 8. 最終状態の確認（employee視点）

**エンドポイント**: `GET /api/expenses`

- **リクエストヘッダー**:
  - `Authorization: employee`
- **期待結果**:
  - ステータスコード: `200`
  - レスポンスボディに2件の経費が含まれること
  - `expenseId1` に該当する経費のステータスが "APPROVED" であること
  - `expenseId2` に該当する経費のステータスが "PENDING" であること

**検証項目**:

**重要**: レスポンスの配列の順序は保証されていません。1番目の経費が必ずしもexpenseId1であるとは限りません。各経費について、IDをチェックして、そのIDに応じた期待ステータスを確認してください。

- レスポンスのステータスコードが200であること
- 配列の長さが2であること:
  - アサーション1:
    - Target: JSON body
    - JSON Path: `$[1]`
    - Assertion: Exists
    - 意味: 2番目の要素が存在すること
  - アサーション2:
    - Target: JSON body
    - JSON Path: `$[2]`
    - Assertion: Does not exist
    - 意味: 3番目の要素が存在しないこと（配列の要素数が2）

**IDとステータスの検証（配列の順序に依存しない検証方法）**:

配列内の各経費について、以下の条件を満たすことを確認してください:
- IDが変数 `expenseId1` と一致する経費が存在し、そのステータスが "APPROVED" であること
- IDが変数 `expenseId2` と一致する経費が存在し、そのステータスが "PENDING" であること

**推奨されるアサーション方法**:

JSONPathのフィルタ式を使用できる場合:
1. アサーション1:
   - Target: JSON body
   - JSON Path: `$[?(@.id==${expenseId1})].status`
   - Assertion: Equals "APPROVED"
   - 意味: IDがexpenseId1と一致する経費のステータスが "APPROVED"

2. アサーション2:
   - Target: JSON body
   - JSON Path: `$[?(@.id==${expenseId2})].status`
   - Assertion: Equals "PENDING"
   - 意味: IDがexpenseId2と一致する経費のステータスが "PENDING"

JSONPathのフィルタ式が使用できない場合の代替方法:
1. 1番目の経費について:
   - まず `$[0].id` が `expenseId1` と等しいかをチェック
   - もし等しければ、`$[0].status` が "APPROVED" であることを確認
   - もし等しくなければ、`$[0].id` が `expenseId2` と等しく、`$[0].status` が "PENDING" であることを確認

2. 2番目の経費について:
   - まず `$[1].id` が `expenseId1` と等しいかをチェック
   - もし等しければ、`$[1].status` が "APPROVED" であることを確認
   - もし等しくなければ、`$[1].id` が `expenseId2` と等しく、`$[1].status` が "PENDING" であることを確認

---

## テスト全体の成功条件

上記の全てのステップが正常に完了し、以下の状態になっていること:

1. ✅ データリセットが成功
2. ✅ リセット後、経費一覧が空である
3. ✅ Conference（5000円）の経費申請が作成される
4. ✅ Taxi（1500円）の経費申請が作成される
5. ✅ employee は自分の経費のみ参照できる
6. ✅ manager は全ての経費を参照できる
7. ✅ manager が Conference の経費を承認できる
8. ✅ 承認後、ステータスが正しく更新される

## 注意事項

- 各ステップは順番に実行してください（前のステップが成功した場合のみ次に進む）
- 認証は Authorization ヘッダーでユーザー名（`employee` または `manager`）を渡します
- JWT トークンなどの認証トークンは不要です
- テスト実行前に必ずデータリセットを行ってください
- テスト実行環境のベースURLは実際のデプロイ先に合わせて変更してください

## 参考情報

- **API仕様書**: `expense-api.yml`
- **テストスクリプト**: `scripts/test-api.sh`
- **エンドポイント一覧**:
  - `POST /api/reset` - データリセット
  - `GET /api/expenses` - 経費一覧取得
  - `POST /api/expenses` - 経費作成
  - `PATCH /api/expenses/{id}/status` - ステータス更新
