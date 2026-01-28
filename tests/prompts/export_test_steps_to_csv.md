# テストステップCSVエクスポート プロンプト

## 概要

mablで作成したテストのステップ情報をCSV形式でエクスポートし、`/tests/steps/` ディレクトリに保存するためのプロンプトです。

**対象テスト種別:**
- **Web テスト** (`[mabl-expense]`, `[mabl-expense-web]`)
- **Mobile テスト** (`[mabl-expense-mobile]`)
- **API テスト** (`[mabl-expense-api]`)

## 前提条件

- mabl MCP サーバーが設定済みであること
- mabl ワークスペースに対象テストが存在すること

## プロンプト

以下のプロンプトを使用して、テストステップをCSV形式でエクスポートしてください。

---

### プロンプト本文

```
mablで作成した mabl-expense アプリのテスト一覧を取得し、
各テストのテストステップをCSV形式で /tests/steps/ フォルダの下に出力してください。

対象テスト:
- Webテスト: [mabl-expense] または [mabl-expense-web] プレフィックスのテスト
- Mobileテスト: [mabl-expense-mobile] プレフィックスのテスト
- APIテスト: [mabl-expense-api] プレフィックスのテスト

## 出力仕様

### ディレクトリ構造
テスト種別ごとにサブディレクトリを作成:
/tests/steps/
├── web/           # Webテスト用
├── mobile/        # Mobileテスト用
└── api/           # APIテスト用

### ファイル名
テスト名をケバブケース（小文字、ハイフン区切り）に変換して使用
例: "[mabl-expense] Manager Login" → web/manager-login.csv
例: "[mabl-expense-mobile] 新規経費申請作成" → mobile/expense-submission.csv
例: "[mabl-expense-api] Reset Data" → api/reset-data.csv

### CSVフォーマット
step_number,action,target,value,context

| 列 | 説明 |
|----|------|
| step_number | ステップ番号（1から開始） |
| action | ステップの種類（Set viewport size, Visit URL, Click, Input, Assert, Echo, Set variable等） |
| target | 操作対象（要素、変数名、viewport等） |
| value | 入力値、期待値、設定値など（なければ「-」） |
| context | ステップの説明・目的 |

### 出力例
```csv
step_number,action,target,value,context
1,Set viewport size,viewport,"width: 1080, height: 1440",Confirm Manager Login Page and Credentials
2,Visit URL,app.url,-,Navigates to the application's URL
3,Echo,-,--> Navigate to the Login Page,Log message
4,Assert innerText,<div> element,経費管理 - Manager Login,Asserts manager login page is displayed
5,Input,username-input,manager,Enter username
6,Input,password-input,manager123,Enter password
7,Click,login-button,-,Click login button
8,Assert,header,経費承認ダッシュボード,Verify dashboard header
```

## 実行手順

1. テスト一覧を取得（get_mabl_tests を使用、クエリ: "mabl-expense"）
2. テスト種別を判定（テスト名のプレフィックスから判断）
   - [mabl-expense] または [mabl-expense-web] → web/
   - [mabl-expense-mobile] → mobile/
   - [mabl-expense-api] → api/
3. 各テストのテスト詳細を取得（get_mabl_test_details を使用）
4. ステップ情報をCSVフォーマットに変換
5. /tests/steps/{種別}/{テスト名}.csv として保存
```

---

## 使用するmabl MCPツール

| ツール | 用途 |
|--------|------|
| `get_mabl_tests` | テスト一覧の取得（クエリで検索可能） |
| `get_applications` | アプリケーション一覧と関連環境の取得 |
| `get_mabl_test_details` | 特定テストの詳細（ステップ情報）取得 |

## 実行例

```bash
# Claude Codeでの実行例（全テスト種別）
claude "
mablで作成した mabl-expense アプリのテスト一覧（Web、Mobile、API）を取得し、
各テストのテストステップをCSV形式で /tests/steps/ フォルダの下に出力してください。
テスト種別ごとにサブディレクトリ（web/, mobile/, api/）に分けて保存してください。
"

# 特定のテスト種別のみエクスポートする場合
claude "
mablで作成した mabl-expense-mobile のテスト一覧を取得し、
各テストのテストステップをCSV形式で /tests/steps/mobile/ フォルダの下に出力してください。
"
```

## 出力ディレクトリ構造

```
/tests/steps/
├── web/                              # Webテスト
│   ├── login-dashboard-navigation.csv
│   ├── manager-expense-approval-flow.csv
│   ├── manager-login.csv
│   └── （その他のWebテストCSV）
├── mobile/                           # Mobileテスト
│   ├── expense-submission.csv
│   └── （その他のMobileテストCSV）
└── api/                              # APIテスト
    ├── reset-data.csv
    └── （その他のAPIテストCSV）
```

## ステップタイプの変換ルール

mablのステップタイプをCSVのaction列に変換する際のルール：

### 共通ステップ（Web/Mobile/API）

| mablステップタイプ | CSV action |
|-------------------|------------|
| Echo | Echo |
| CreateVariable | Set variable |
| Wait | Wait |
| WaitUntil | Wait until |
| If | If |
| GenAIAssert | GenAI Assert |

### Webテスト固有

| mablステップタイプ | CSV action |
|-------------------|------------|
| SetViewport | Set viewport size |
| VisitUrl | Visit URL |
| Click | Click |
| EnterText | Input |
| AssertEquals | Assert |
| AssertInnerText | Assert innerText |
| AssertContains | Assert contains |
| Hover | Hover |
| Select | Select |
| Scroll | Scroll |
| DragAndDrop | Drag and drop |

### Mobileテスト固有

| mablステップタイプ | CSV action |
|-------------------|------------|
| Tap | Tap |
| Swipe | Swipe |
| LongPress | Long press |
| TypeText | Type text |
| ClearText | Clear text |
| AssertVisible | Assert visible |
| AssertNotVisible | Assert not visible |
| ScrollTo | Scroll to |
| Back | Back button |
| Home | Home button |
| LaunchApp | Launch app |
| CloseApp | Close app |
| SetOrientation | Set orientation |

### APIテスト固有

| mablステップタイプ | CSV action |
|-------------------|------------|
| HttpRequest | HTTP Request |
| AssertStatusCode | Assert status code |
| AssertResponseBody | Assert response body |
| AssertHeader | Assert header |
| ExtractFromResponse | Extract from response |
| SetRequestHeader | Set request header |
| SetRequestBody | Set request body |

## 注意事項

- テスト名に日本語が含まれる場合は、英語部分のみをファイル名に使用するか、適切な英語名に変換してください
- value列にカンマが含まれる場合は、ダブルクォートで囲んでください
- context列はステップの目的や説明を簡潔に記載してください

### テスト種別の判定ルール

| プレフィックス | テスト種別 | 出力先 |
|--------------|----------|--------|
| `[mabl-expense]` | Web | `/tests/steps/web/` |
| `[mabl-expense-web]` | Web | `/tests/steps/web/` |
| `[mabl-expense-mobile]` | Mobile | `/tests/steps/mobile/` |
| `[mabl-expense-api]` | API | `/tests/steps/api/` |

### APIテストのCSV出力例

```csv
step_number,action,target,value,context
1,Set variable,base_url,{{app.url}},Set API base URL
2,HTTP Request,POST {{base_url}}/api/reset,-,Reset database
3,Assert status code,response,200,Verify reset succeeded
4,HTTP Request,GET {{base_url}}/api/expenses,-,Get all expenses
5,Assert response body,$.length,3,Verify 3 expenses exist
```

### MobileテストのCSV出力例

```csv
step_number,action,target,value,context
1,Launch app,com.mabl.expense,-,Launch expense app
2,Assert visible,Login Screen,-,Verify login screen displayed
3,Tap,username-input,-,Tap username field
4,Type text,username-input,employee,Enter username
5,Tap,password-input,-,Tap password field
6,Type text,password-input,employee123,Enter password
7,Tap,login-button,-,Tap login button
8,Assert visible,Home Screen,-,Verify home screen displayed
```

## 関連ファイル

- 出力先: `/tests/steps/*.csv`
- テスト設計改善プロンプト: `/tests/prompts/test_design_improvement_prompt.md`
- アーティファクトエクスポートプロンプト: `/tests/prompts/export_test_artifacts.md`

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-01-28 | 初版作成 |
| 2026-01-28 | Mobile/APIテスト対応を追加: テスト種別ごとのサブディレクトリ構造、ステップタイプ変換ルール、出力例を追加 |
