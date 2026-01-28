# テスト実行結果アーティファクト エクスポート プロンプト

## 概要

mablテストの実行結果（アーティファクト）をエクスポートし、`/tests/artifacts/` ディレクトリに保存するためのプロンプトです。

**対象テスト種別:**
- **Web テスト** (`[mabl-expense]`, `[mabl-expense-web]`)
- **Mobile テスト** (`[mabl-expense-mobile]`)
- **API テスト** (`[mabl-expense-api]`)

### アーティファクトの種類（テスト種別による違い）

| アーティファクト | Web | Mobile | API | 説明 |
|----------------|-----|--------|-----|------|
| **Screenshots** | ✅ | ✅ | - | 各ステップのスクリーンショット |
| **DOM** | ✅ | - | - | テスト実行時のDOM状態 |
| **HAR** | ✅ | - | ✅ | ネットワークリクエスト/レスポンスのログ |
| **Traces** | ✅ | ✅ | ✅ | 実行トレース情報 |
| **Console Logs** | ✅ | ✅ | - | コンソールログ |
| **manifest.yaml** | ✅ | ✅ | ✅ | アーティファクトのメタデータ |

## 前提条件

- mabl CLI がインストール済みであること（`npm install -g @mablhq/mabl-cli`）
- mabl にログイン済みであること（`mabl auth login`）
- 対象テストが少なくとも1回実行されていること

## プロンプト

以下のプロンプトを使用して、テスト実行結果のアーティファクトをエクスポートしてください。

---

### プロンプト本文

```
mablで作成した mabl-expense アプリの各テスト（Web、Mobile、API）の実行結果（アーティファクト）を
/tests/artifacts/ ディレクトリの下にテスト種別ごとのサブディレクトリを作成し、その下に格納してください。

対象テスト:
- Webテスト: [mabl-expense] または [mabl-expense-web] プレフィックスのテスト
- Mobileテスト: [mabl-expense-mobile] プレフィックスのテスト
- APIテスト: [mabl-expense-api] プレフィックスのテスト

## 出力仕様

### ディレクトリ構造
テスト種別ごとにサブディレクトリを作成:
/tests/artifacts/
├── web/                    # Webテスト用
│   ├── {テスト名}/
│   │   ├── doms/           # DOM状態
│   │   ├── hars/           # HARファイル（ネットワークログ）
│   │   ├── screenshots/    # スクリーンショット
│   │   ├── traces/         # トレース情報
│   │   ├── console_logs/   # コンソールログ
│   │   └── manifest.yaml   # メタデータ
│   └── ...
├── mobile/                 # Mobileテスト用
│   ├── {テスト名}/
│   │   ├── screenshots/    # スクリーンショット
│   │   ├── traces/         # トレース情報
│   │   ├── console_logs/   # コンソールログ
│   │   └── manifest.yaml   # メタデータ
│   └── ...
└── api/                    # APIテスト用
    ├── {テスト名}/
    │   ├── hars/           # HARファイル（APIリクエスト/レスポンス）
    │   ├── traces/         # トレース情報
    │   └── manifest.yaml   # メタデータ
    └── ...

### テスト名（ディレクトリ名）
テスト名をケバブケース（小文字、ハイフン区切り）に変換して使用
例: "[mabl-expense] Manager Login" → web/manager-login
例: "[mabl-expense-mobile] 新規経費申請作成" → mobile/expense-submission
例: "[mabl-expense-api] Reset Data" → api/reset-data

## 実行手順

1. テスト一覧を取得（get_mabl_tests を使用、クエリ: "mabl-expense"）
2. テスト種別を判定（テスト名のプレフィックスから判断）
   - [mabl-expense] または [mabl-expense-web] → web/
   - [mabl-expense-mobile] → mobile/
   - [mabl-expense-api] → api/
3. 各テストの最新実行結果を取得（get_latest_test_runs を使用）
4. 実行結果がある場合、mabl CLIでアーティファクトをエクスポート
5. ZIPファイルを展開して適切なディレクトリに配置
6. 実行結果がない場合、READMEファイルを作成して説明を記載

## 実行結果がない場合

テストがまだ実行されていない場合は、以下の内容でREADME.mdを作成：
- テストID
- テスト名
- テスト種別（Web/Mobile/API）
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
# Claude Codeでの実行例（全テスト種別）
claude "
mablで作成した mabl-expense アプリの各テスト（Web、Mobile、API）の実行結果（アーティファクト）を
/tests/artifacts/ ディレクトリの下にテスト種別ごとのサブディレクトリ（web/, mobile/, api/）を作成し、格納してください。
ZIPファイルは展開して配置してください。
"

# 特定のテスト種別のみエクスポートする場合
claude "
mablで作成した mabl-expense-mobile のテストの実行結果（アーティファクト）を
/tests/artifacts/mobile/ ディレクトリの下に格納してください。
"
```

## 出力ディレクトリ構造の例

```
/tests/artifacts/
├── web/                                    # Webテスト
│   ├── manager-expense-approval-flow/
│   │   ├── doms/
│   │   │   ├── step_001.html
│   │   │   ├── step_002.html
│   │   │   └── ...
│   │   ├── hars/
│   │   │   └── network.har
│   │   ├── screenshots/
│   │   │   ├── step_001.png
│   │   │   ├── step_002.png
│   │   │   └── ...
│   │   ├── traces/
│   │   │   └── trace.json
│   │   ├── console_logs/
│   │   │   └── console.json
│   │   └── manifest.yaml
│   ├── manager-login/
│   │   └── ...
│   └── expense-approval/
│       └── README.md  # テスト未実行の場合
├── mobile/                                 # Mobileテスト
│   └── expense-submission/
│       ├── screenshots/
│       │   ├── step_001.png
│       │   ├── step_002.png
│       │   └── ...
│       ├── traces/
│       │   └── trace.json
│       ├── console_logs/
│       │   └── console.json
│       └── manifest.yaml
└── api/                                    # APIテスト
    └── reset-data/
        ├── hars/
        │   └── api_requests.har
        ├── traces/
        │   └── trace.json
        └── manifest.yaml
```

## manifest.yamlの構造

### Webテストの場合

```yaml
test_run_id: "SitSPGAijPeZDY9UEJifaQ-jr"
test_id: "RE2ObHQFXFHunmXBT0idRQ-j"
test_name: "[mabl-expense] Manager Expense Approval Flow"
test_type: "browser"
environment: "Production"
browser: "chrome"
browser_version: "142.0.7444.175"
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
  - type: console_log
    count: 1
```

### Mobileテストの場合

```yaml
test_run_id: "MobileTestRunId-jr"
test_id: "MobileTestId-j"
test_name: "[mabl-expense-mobile] 新規経費申請作成"
test_type: "mobile"
environment: "Production"
device: "iPhone 14"
os_version: "iOS 17.0"
status: "passed"
started_at: "2026-01-28T10:00:00Z"
completed_at: "2026-01-28T10:02:00Z"
artifacts:
  - type: screenshot
    count: 8
  - type: trace
    count: 1
  - type: console_log
    count: 1
```

### APIテストの場合

```yaml
test_run_id: "ApiTestRunId-jr"
test_id: "ApiTestId-j"
test_name: "[mabl-expense-api] Reset Data"
test_type: "api"
environment: "Production"
status: "passed"
started_at: "2026-01-28T10:00:00Z"
completed_at: "2026-01-28T10:00:05Z"
artifacts:
  - type: har
    count: 1
  - type: trace
    count: 1
```

## テスト未実行時のREADME.mdテンプレート

```markdown
# {テスト名} - Test Artifacts

## Test Information
- **Test ID**: `{test-id}`
- **Test Name**: {テスト名}
- **Test Type**: {Web/Mobile/API}

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
tests/artifacts/web/*/doms/
tests/artifacts/web/*/hars/
tests/artifacts/web/*/screenshots/
tests/artifacts/web/*/traces/
tests/artifacts/web/*/console_logs/
tests/artifacts/mobile/*/screenshots/
tests/artifacts/mobile/*/traces/
tests/artifacts/mobile/*/console_logs/
tests/artifacts/api/*/hars/
tests/artifacts/api/*/traces/
!tests/artifacts/**/README.md
!tests/artifacts/**/manifest.yaml
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
| 2026-01-28 | Web/Mobile/APIテスト対応、ディレクトリ構造を種別ごとに整理 |
