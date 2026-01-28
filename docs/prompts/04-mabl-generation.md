# 指示: mabl Test Creation Agent用プロンプトの作成

mablの「Test Creation Agent（生成AIによるテスト作成機能）」に入力するための、自然言語プロンプトと詳細なテスト仕様書を作成してください。

## 参照ファイル
* `/docs/spec-expense-app.md` (アプリケーション全体仕様)
* `/docs/prompts/01-api.md` (API仕様・エンドポイント)
* `/docs/prompts/02-web.md` (Web仕様・data-testid一覧)
* `/docs/prompts/03-mobile.md` (Mobile仕様・testID一覧)

## テストデータ（統一）
すべてのテストで以下のデータを使用してください：
- **経費タイトル**: `Taxi`
- **経費金額**: `1500`
- **申請者**: `employee`
- **承認者**: `manager`

---

## 作成してほしいテストケース

### 1. APIテスト用 (`11-api-test.md`)

**自然言語プロンプト:**
```
経費管理APIの初期化エンドポイント(/api/reset)を呼び出し、
正常に初期化されることを確認するテストを作成して
```

**テスト内容:**
- `POST /api/reset` を実行
- HTTPステータス 200 OK を確認
- レスポンスに `message` が含まれることを確認

---

### 2. Mobileテスト用 (`13-mobile-test.md`)

**自然言語プロンプト:**
```
mabl-expenseアプリのモバイル版に、従業員(employee)としてログインし、
タイトル「Taxi」、金額「1500」で経費を申請し、
申請履歴にPENDINGステータスで表示されることを確認するテストを作成して
```

**テスト内容:**
- ログイン画面で `employee` / `employee123` を入力
- ホーム画面で新規申請フォームを表示
- タイトル「Taxi」、金額「1500」を入力して申請
- 申請履歴に「Taxi」が表示されることを確認
- ステータスが「PENDING」であることを確認

**使用するtestID** (`03-mobile.md`から参照):
- `username-input`: ユーザー名入力
- `password-input`: パスワード入力
- `login-button`: ログインボタン
- `title-input`: タイトル入力
- `amount-input`: 金額入力
- `submit-button`: 申請ボタン
- `expense-item-{title}`: 経費項目
- `expense-status-{id}`: ステータス表示

---

### 3. Webテスト用 (`12-web-test.md`)

**自然言語プロンプト:**
```
mabl-expenseアプリに、管理者(manager)としてログインし、
部下が申請した経費の表示件数や合計金額、個々の申請の内容を確認した上で、
未承認の申請を承認するテストを作成して。出力は必ず日本語で。
```

**テスト内容:**
- ログイン画面で `manager` / `manager123` を入力
- ダッシュボードで経費一覧を表示
- **経費の表示件数をチェック**（生成AIアサーション: `total-count`）
- **合計金額をチェック**（生成AIアサーション: `total-amount`）
- **個々の申請の内容を確認**:
  - タイトル（`expense-title-{id}`）
  - 金額（`expense-amount-{id}`）
  - 申請者（`expense-applicant-{id}`）
  - ステータス（`expense-status-{id}`）
- ステータスが PENDING の経費を探す
- 承認ボタンをクリック
- ステータスが APPROVED に変わることを検証

**使用するdata-testid** (`02-web.md`から参照):
- `username-input`: ユーザー名入力
- `password-input`: パスワード入力
- `login-button`: ログインボタン
- `total-count`: 件数表示 → **表示件数の確認**
- `total-amount`: 合計金額表示 → **合計金額の確認**
- `expense-row-{id}`: 経費行 → **申請の存在確認**
- `expense-title-{id}`: タイトル列 → **申請タイトルの確認**
- `expense-amount-{id}`: 金額列 → **金額の確認**
- `expense-applicant-{id}`: 申請者列 → **申請者の確認**
- `expense-status-{id}`: ステータス列 → **ステータスの確認**
- `approve-button-{id}`: 承認ボタン → **承認操作**
- `logout-button`: ログアウトボタン

---

## 出力フォーマット

各テストケースについて、以下の形式で詳細なテスト仕様書を出力してください：

### 必須セクション

1. **自然言語プロンプト（mabl Test Creation Agent向け）**
   - mablに直接入力できる自然言語の指示文

2. **テスト対象アプリケーション**
   - ベースURL
   - 対象フレームワーク
   - 参照する仕様書

3. **テストの前提条件**
   - 事前準備（APIリセット、テストデータ作成など）

4. **テストシナリオ**
   - テストの目的（箇条書き）

5. **テスト実行手順**
   - ステップごとに以下を記載：
     - アクション（何をするか）
     - 対象要素（data-testid / testID）
     - 入力値または操作内容
     - 検証項目（期待される結果）

6. **検証ポイント（データ検証）**
   - ページ要素の検証（表形式）
   - API連携の検証（エンドポイント、リクエスト/レスポンス）

7. **環境変数・設定**
   - テスト実行に必要な環境変数

8. **トラブルシューティング**
   - よくあるエラーと対処法（表形式）

9. **プロンプトとテストステップの対応表**
   - 自然言語プロンプトから生成されるステップの対応

10. **参考資料**
    - 関連するドキュメントへのリンク

---

## 生成AIアサーションの活用

mablの生成AIアサーション機能を活用する箇所を明示してください：

### 活用ポイント
- **件数チェック**: 具体的な数値を指定せず「件数として妥当か」を自動判定
- **金額チェック**: 具体的な数値を指定せず「金額として妥当か」を自動判定
- **ステータス変更**: 「PENDING」→「APPROVED」の変化を検証

### 記載例
```markdown
### ステップ X: 件数・合計金額の確認（生成AIアサーション）

**アクション**: Dashboard ページでサマリー情報を確認

- **対象要素**:
  - 件数表示: `data-testid="total-count"`
  - 合計金額表示: `data-testid="total-amount"`

- **検証項目（生成AIアサーションで自動判定）**:
  - 件数が表示されていること（例: 「2件」「3件」など）
  - 合計金額が表示されていること（例: 「¥3,500」など）
  - 件数と金額が妥当な値であること（0以上の数値）

**ポイント**: mablの生成AIアサーションにより、具体的な数値を事前に指定しなくても、表示内容が「件数として妥当か」「金額として妥当か」を自動判定できます。
```

---

## data-testid / testID の活用

テスト仕様書には、必ず対応するdata-testid（Web）またはtestID（Mobile）を明記してください。

### Web (02-web.mdから)
| 要素 | data-testid |
|------|-------------|
| ユーザー名入力 | `username-input` |
| パスワード入力 | `password-input` |
| ログインボタン | `login-button` |
| 件数表示 | `total-count` |
| 合計金額表示 | `total-amount` |
| 経費行 | `expense-row-{id}` |
| ステータス列 | `expense-status-{id}` |
| 承認ボタン | `approve-button-{id}` |
| ログアウトボタン | `logout-button` |

### Mobile (03-mobile.mdから)
| 要素 | testID |
|------|--------|
| ユーザー名入力 | `username-input` |
| パスワード入力 | `password-input` |
| ログインボタン | `login-button` |
| タイトル入力 | `title-input` |
| 金額入力 | `amount-input` |
| 申請ボタン | `submit-button` |
| 経費項目 | `expense-item-{title}` |
| ステータス | `expense-status-{id}` |

---

## 出力ファイル

以下のファイルを生成してください：
- `/docs/prompts/11-api-test.md` - APIテスト仕様書
- `/docs/prompts/12-web-test.md` - Webテスト仕様書
- `/docs/prompts/13-mobile-test.md` - Mobileテスト仕様書

---

## 出力言語

生成するテスト仕様書（11-api-test.md, 12-web-test.md, 13-mobile-test.md）は、
すべて**日本語**で記述してください。

- ステップの説明
- 検証項目の記述
- トラブルシューティング
- すべてのセクションを日本語で出力
