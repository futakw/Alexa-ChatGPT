# AlexaとChatGPTの連携

AlexaとChatGPTを連携させることで、音声でChatGPTに質問したり、会話を楽しんだりすることができる。このリポジトリでは、そのためのサンプルコードと設定方法を提供している。

## 機能
- Alexaを通じてChatGPTに質問
- ChatGPTの回答をAlexaが音声で返答
- 会話の履歴を保持し、コンテキストを理解した応答
- 簡潔な回答を促すためのプロンプト設定
- 環境変数で設定可能な柔軟な構成

## 必要なもの
- Amazon Developerアカウント
- OpenAIアカウントとAPIキー（有料）
- AWSアカウント

## セットアップ手順
1. ほぼこれを参考にセットアップ（ https://note.com/eito_hijikata/n/nd81a26f26faa ）
 - javaScriptで作成することに注意
2. OpenAIのAPIキーを取得し、`lambda/config/keys.js`に設定
3. 環境変数を設定（`lambda/config/appConfig.js`を参照）
4. AWS CLIを使用してAWS Lambdaにデプロイ