# 指示: mabl Test Creation Agent用プロンプトの作成

mablの「Test Creation Agent（生成AIによるテスト作成機能）」に入力するための、自然言語プロンプトを作成してください。
以下の3つのテストケースについて、mablに入力する具体的な指示文を出力してください。

## 参照ファイル
* `/docs/spec-expense-app.md` (セクション7: デモシナリオ)

## 作成してほしいプロンプトの内容
1. **APIテスト用:** `/api/reset` を叩いて200 OKを確認する手順。
2. **Mobileテスト用:** ユーザー `employee` でログインし、タイトル「Conference」、金額「1000」で申請を行い、リスト上のステータスが「PENDING」であることを確認する手順。
3. **Webテスト用:** ユーザー `manager` でログインし、リストから「Conference」の行を探して承認ボタンを押し、ステータスが「APPROVED」に変わることを確認する手順。