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
3. すべての操作可能な要素（入力欄、ボタン、リストアイテム）に、仕様書で指定された `testID` を付与してください。
4. API接続先は、Androidエミュレーターからアクセスするため `http://10.0.2.2:4000` (localhostのエイリアス) を使用するか、環境変数で切り替えられるようにしてください。
5. 一覧画面には "Pull to Refresh" 機能を実装してください。