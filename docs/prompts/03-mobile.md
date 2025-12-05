# Step 3: Mobile Application (React Native)

## Context (Attach files)
- docs/spec-expense-app.md
- apps/mobile/ (ディレクトリ)

## Prompt
@docs/spec-expense-app.md を参照してください。
apps/mobile/ ディレクトリ内に、仕様書に基づいた React Native (Expo) アプリケーションを実装してください。

要件:
1. `/app` ディレクトリ配下に画面を作成してください (Expo Router想定)。
2. ログイン画面と、経費申請/一覧画面を実装してください。
3. **重要:** すべての操作可能な要素（入力欄、ボタン、リストアイテム）に、仕様書で指定された `testID` を付与してください。これがAppium/mablでのテストに必須です。
4. API接続設定:
    - AndroidエミュレーターからホストマシンのAPIサーバー(PostgreSQL接続)へアクセスするため、ベースURLは `http://10.0.2.2:4000` を使用してください。
    - 開発の利便性のため、定数ファイル等でURLを一箇所で管理してください。
5. 一覧画面には `RefreshControl` を使用した "Pull to Refresh" 機能を実装し、データを再取得できるようにしてください。