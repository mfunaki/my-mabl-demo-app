# 指示: プロジェクトの初期セットアップ

あなたは熟練したFull Stackエンジニアです。
以下の仕様に基づき、モノリポ構成のプロジェクト基盤を作成するためのコマンドと設定ファイルを作成してください。

## 参照ファイル
* `/docs/spec-expense-app.md`

## 要件
1. **ディレクトリ構造:**
    * ルート直下に `apps/api`, `apps/web`, `apps/mobile` を配置。
    * パッケージ管理は `npm workspaces` を使用。
2. **Docker Compose:**
    * `docker-compose.yml` をルートに作成。
    * `postgres` (DB), `api` (Backend), `web` (Frontend) の3つのサービスを定義。
    * ネットワーク設定: 各コンテナが相互通信できるようにし、ホストからもポートフォワード(DB:5432, API:4000, Web:3000)を設定。
3. **成果物:**
    * 実行すべき `mkdir` や `npm init` などのシェルコマンド。
    * `package.json` (ルート) の内容。
    * `docker-compose.yml` の内容。
    * `.gitignore` の内容。

このプロンプトへの回答では、具体的なコードブロックのみを出力してください。