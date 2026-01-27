# 指示: Mobile Appの実装

`apps/mobile` ディレクトリに、React Native (Expo) を使用した申請アプリを実装してください。

## 参照ファイル
* `/docs/spec-expense-app.md` (Mobile仕様)

## 要件

### 1. Tech Stack
Expo (TypeScript), React Navigation (`@react-navigation/native-stack`), axios, AsyncStorage.

### 2. ディレクトリ構成
```
apps/mobile/
├── App.tsx                  # メインナビゲーション設定
├── index.ts                 # エントリーポイント
├── screens/
│   ├── LoginScreen.tsx      # ログイン画面
│   └── HomeScreen.tsx       # ホーム画面（申請フォーム + 履歴リスト）
├── services/
│   ├── api.ts               # APIクライアント（axios）
│   └── auth.ts              # 認証ヘルパー（AsyncStorage）
└── types/
    └── expense.ts           # 型定義（Expense, ExpenseFormData）
```

### 3. Screens
* **Login** (`screens/LoginScreen.tsx`): 従業員 (`employee`/`employee123`) ログイン画面。
* **Home** (`screens/HomeScreen.tsx`): 申請フォームと履歴リスト。Pull to Refresh対応。ログアウト機能を含む。

### 4. 認証
* AsyncStorage に `username` を保存する簡易実装。
* パスワード検証: `{username}123` 形式（例: `employee` → `employee123`）。
* APIリクエスト時に `Authorization` ヘッダーにユーザー名を設定。

### 5. API連携
* `app.config.ts` の `extra.apiUrl` で接続先を設定（`EXPO_PUBLIC_API_URL` 環境変数から取得）。
* `Constants.expoConfig?.extra?.apiUrl` でランタイム時に取得。

### 6. テスト属性 (重要)
Appium (mabl) での要素特定を確実にするため、操作可能な要素には `testID` と `accessibilityLabel` の両方を付与すること。

**ログイン画面:**
* `login-title`: ログインタイトル
* `username-input`: ユーザー名入力欄
* `password-input`: パスワード入力欄
* `login-button`: ログインボタン

**ホーム画面:**
* `logout-button`: ログアウトボタン
* `title-input`: タイトル入力欄
* `amount-input`: 金額入力欄
* `submit-button`: 申請ボタン
* `refresh-control`: Pull to Refresh
* `empty-message`: データなしメッセージ

**経費リスト（各アイテム）:**
* `expense-item-${title}`: 経費アイテム（タイトルベース）
* `expense-title-${id}`: タイトル
* `expense-status-${id}`: ステータスバッジ
* `expense-amount-${id}`: 金額

### 7. 開発時デバッグ機能
* `__DEV__` フラグで開発時のみ API 接続テストボタンを表示。

このプロンプトへの回答として、主要なソースコード（`App.tsx`, `LoginScreen.tsx`, `HomeScreen.tsx`, APIクライアント等）を出力してください。