# 指示: Mobile Appの実装

`apps/mobile` ディレクトリに、React Native (Expo) を使用した申請アプリを実装してください。

## 参照ファイル
* `/docs/spec-expense-app.md` (Mobile仕様)

## 要件
1. **Tech Stack:** Expo (TypeScript), Expo Router.
2. **Screens:**
    * Login: 従業員 (`employee`/`employee123`) ログイン。
    * Home: 申請フォームと履歴リスト。Pull to Refresh対応。
3. **API連携:**
    * 環境変数 `EXPO_PUBLIC_API_URL` を使用して接続先を切り替えられるようにする。
4. **テスト属性 (重要):**
    * Appium (mabl) での要素特定を確実にするため、操作可能な要素には `testID` と `accessibilityLabel` の両方を付与すること。
    * リストアイテムには `expense-item-${title}` のような動的なIDを振ること。

このプロンプトへの回答として、主要なソースコードを出力してください。