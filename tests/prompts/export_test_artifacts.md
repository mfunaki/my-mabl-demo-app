# テスト実行結果アーティファクト エクスポート プロンプト

## 概要

mablテストの実行結果（アーティファクト）をエクスポートし、`/tests/artifacts/` ディレクトリに保存するためのプロンプトです。

アーティファクトには以下が含まれます：
- **DOM**: テスト実行時のDOM状態
- **HAR**: ネットワークリクエスト/レスポンスのログ
- **Screenshots**: 各ステップのスクリーンショット
- **Traces**: 実行トレース情報
- **manifest.yaml**: アーティファクトのメタデータ

## 前提条件

- mabl CLI がインストール済みであること（`npm install -g @mablhq/mabl-cli`）
- mabl にログイン済みであること（`mabl auth login`）
- 対象テストが少なくとも1回実行されていること

## プロンプト

以下のプロンプトを使用して、テスト実行結果のアーティファクトをエクスポートしてください。

---

### プロンプト本文

```
mablで作成した mabl-expense ウェブアプリの各テストの実行結果（アーティファクト）を
/tests/artifacts/ ディレクトリの下にテストごとのサブディレクトリを作成し、その下に格納してください。

## 出力仕様

### ディレクトリ構造
/tests/artifacts/
├── {テスト名}/
│   ├── doms/           # DOM状態
│   ├── hars/           # HARファイル（ネットワークログ）
│   ├── screenshots/    # スクリーンショット
│   ├── traces/         # トレース情報
│   └── manifest.yaml   # メタデータ
└── {テスト名}/
    └── ...

### テスト名（ディレクトリ名）
テスト名をケバブケース（小文字、ハイフン区切り）に変換して使用
例: "[mabl-expense] Manager Expense Approval Flow" → manager-expense-approval-flow

## 実行手順

1. テスト一覧を取得（get_mabl_tests を使用）
2. 各テストの最新実行結果を取得（get_latest_test_runs を使用）
3. 実行結果がある場合、mabl CLIでアーティファクトをエクスポート
4. ZIPファイルを展開して適切なディレクトリに配置
5. 実行結果がない場合、READMEファイルを作成して説明を記載

## 実行結果がない場合

テストがまだ実行されていない場合は、以下の内容でREADME.mdを作成：
- テストID
- テスト名
- 「No test runs found」のステータス
- テスト実行後のエクスポートコマンド例
```

---

## 使用するmabl MCPツール

| ツール | 用途 |
|--------|------|
| `get_mabl_tests` | テスト一覧の取得 |
| `get_latest_test_runs` | テストの最新実行結果を取得 |
| `get_mabl_test_details` | テストの詳細情報を取得 |

## 使用するmabl CLIコマンド

```bash
# アーティファクトのエクスポート
mabl test-runs export <test-run-id> --types all

# エクスポート可能なタイプ
# --types all          # 全てのアーティファクト
# --types doms         # DOMのみ
# --types hars         # HARファイルのみ
# --types screenshots  # スクリーンショットのみ
# --types traces       # トレースのみ
```

## 実行例

```bash
# Claude Codeでの実行例
claude "
mablで作成した mabl-expense ウェブアプリの各テストの実行結果（アーティファクト）を
/tests/artifacts/ ディレクトリの下にテストごとのサブディレクトリを作成し、格納してください。
ZIPファイルは展開して配置してください。
"
```

## 出力ディレクトリ構造の例

```
/tests/artifacts/
├── manager-expense-approval-flow/
│   ├── doms/
│   │   ├── step_001.html
│   │   ├── step_002.html
│   │   └── ...
│   ├── hars/
│   │   └── network.har
│   ├── screenshots/
│   │   ├── step_001.png
│   │   ├── step_002.png
│   │   └── ...
│   ├── traces/
│   │   └── trace.json
│   └── manifest.yaml
├── manager-login/
│   └── README.md  # テスト未実行の場合
└── login-dashboard-navigation/
    └── README.md  # テスト未実行の場合
```

## manifest.yamlの構造

```yaml
test_run_id: "SitSPGAijPeZDY9UEJifaQ-jr"
test_id: "RE2ObHQFXFHunmXBT0idRQ-j"
test_name: "[mabl-expense] Manager Expense Approval Flow"
environment: "Production"
browser: "chrome"
status: "passed"
started_at: "2026-01-28T10:00:00Z"
completed_at: "2026-01-28T10:01:30Z"
artifacts:
  - type: dom
    count: 9
  - type: har
    count: 1
  - type: screenshot
    count: 9
  - type: trace
    count: 1
```

## テスト未実行時のREADME.mdテンプレート

```markdown
# {テスト名} - Test Artifacts

## Test Information
- **Test ID**: `{test-id}`
- **Test Name**: {テスト名}

## Status
**No test runs found** - このテストはまだ実行されていません。

テストを実行後、以下のコマンドでアーティファクトをエクスポートできます：

\`\`\`bash
mabl test-runs export <test-run-id> --types all
\`\`\`
```

## 注意事項

- mabl CLIが未インストールの場合は、先にインストールしてください
- アーティファクトのサイズが大きい場合があるため、`.gitignore`に追加することを検討してください
- 古い実行結果のアーティファクトは一定期間後に削除される場合があります

## .gitignore設定例

```gitignore
# mabl test artifacts (large files)
tests/artifacts/*/doms/
tests/artifacts/*/hars/
tests/artifacts/*/screenshots/
tests/artifacts/*/traces/
!tests/artifacts/*/README.md
!tests/artifacts/*/manifest.yaml
```

## 関連ファイル

- 出力先: `/tests/artifacts/*/`
- テストステップCSVエクスポート: `/tests/prompts/export_test_steps_to_csv.md`
- テスト設計改善プロンプト: `/tests/prompts/test_design_improvement_prompt.md`

## トラブルシューティング

### mabl CLIが見つからない場合
```bash
npm install -g @mablhq/mabl-cli
mabl auth login
```

### test-run-idが不明な場合
mabl MCPツールの `get_latest_test_runs` を使用してテストIDから最新の実行IDを取得できます。

### エクスポートに失敗する場合
- mabl認証が有効か確認: `mabl auth status`
- ワークスペースが正しいか確認: `mabl config`
- テストが実行済みか確認: mabl UIで実行履歴を確認

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-01-28 | 初版作成 |
