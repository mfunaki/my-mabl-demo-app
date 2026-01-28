# テストステップCSVエクスポート プロンプト

## 概要

mablで作成したテストのステップ情報をCSV形式でエクスポートし、`/tests/steps/` ディレクトリに保存するためのプロンプトです。

## 前提条件

- mabl MCP サーバーが設定済みであること
- mabl ワークスペースに対象テストが存在すること

## プロンプト

以下のプロンプトを使用して、テストステップをCSV形式でエクスポートしてください。

---

### プロンプト本文

```
mablで作成した mabl-expense ウェブアプリのテスト一覧を取得し、
各テストのテストステップをCSV形式で /tests/steps/ フォルダの下に出力してください。

## 出力仕様

### ファイル名
テスト名をケバブケース（小文字、ハイフン区切り）に変換して使用
例: "[mabl-expense] Manager Login" → manager-login.csv

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

1. テスト一覧を取得（get_mabl_tests または get_applications を使用）
2. 各テストのテスト詳細を取得（get_mabl_test_details を使用）
3. ステップ情報をCSVフォーマットに変換
4. /tests/steps/{テスト名}.csv として保存
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
# Claude Codeでの実行例
claude "
mablで作成した mabl-expense ウェブアプリのテスト一覧を取得し、
各テストのテストステップをCSV形式で /tests/steps/ フォルダの下に出力してください。
"
```

## 出力ディレクトリ構造

```
/tests/steps/
├── login-dashboard-navigation.csv
├── manager-expense-approval-flow.csv
├── manager-login.csv
└── （その他のテストステップCSV）
```

## ステップタイプの変換ルール

mablのステップタイプをCSVのaction列に変換する際のルール：

| mablステップタイプ | CSV action |
|-------------------|------------|
| SetViewport | Set viewport size |
| VisitUrl | Visit URL |
| Click | Click |
| EnterText | Input |
| AssertEquals | Assert |
| AssertInnerText | Assert innerText |
| AssertContains | Assert contains |
| Echo | Echo |
| CreateVariable | Set variable |
| Wait | Wait |
| WaitUntil | Wait until |
| If | If |
| Hover | Hover |
| Select | Select |
| GenAIAssert | GenAI Assert |

## 注意事項

- テスト名に日本語が含まれる場合は、英語部分のみをファイル名に使用するか、適切な英語名に変換してください
- value列にカンマが含まれる場合は、ダブルクォートで囲んでください
- context列はステップの目的や説明を簡潔に記載してください

## 関連ファイル

- 出力先: `/tests/steps/*.csv`
- テスト設計改善プロンプト: `/tests/prompts/test_design_improvement_prompt.md`
- アーティファクトエクスポートプロンプト: `/tests/prompts/export_test_artifacts.md`

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-01-28 | 初版作成 |
