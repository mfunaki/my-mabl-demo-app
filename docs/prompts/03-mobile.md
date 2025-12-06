# 指示: Mobile Appの実装

`apps/mobile` ディレクトリに、React Native (Expo) を使用した申請アプリを実装してください。

## 参照ファイル
* `/docs/spec-expense-app.md` (Mobile仕様)

## 要件
1. **Tech Stack:** Expo (TypeScript), Expo Router.
2. **Screens:**
    * Login: 従業員ログイン。
    * Home: 申請フォームと履歴リスト。Pull to Refresh対応。
3. **API連携:**
    * 環境変数 `EXPO_PUBLIC_API_URL` を使用。
4. **テスト属性:**
    * 仕様書「6. Mobile仕様」に基づき、要素に `testID` と `accessibilityLabel` の両方を付与すること。
    * 特にリストアイテムは `expense-item-${title}` のように動的なIDを振ること。

## 成果物
* `apps/mobile` 配下の主要なソースコード。