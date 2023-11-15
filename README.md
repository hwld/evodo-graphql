# evodo-graphql

## 概要

GraphQL を試すために作った、GraphQL と Next.js で作る todo リスト。  
シンプルな機能から始めて、気が向いたら複雑にしていきたい。

## 使用する技術

- GraphQL Yoga
- urql
- Next.js
- TypeScript
- pnpm

## 開発の進め方

忘れないように記録しておく

### 共通

- プロジェクトのルートで`pnpm dev`を実行する(frontend,backend の codegen,dev が混ざるので分けたければ別で実行する)
- 基本的に backend と frontend は独立させたいので、ルートでパッケージのインストールは行わない
- **GraphQL 関連の修正を行ったら GraphQL LSP を手動で restart する**
  - 修正しても VSCode 上でエラーが出る、補完が効かないときは大抵 restart を忘れてる
  - どうにかならないんだろうか・・・

### バックエンド

`src/schema/`の graphql ファイルを編集して、自動生成された`src/schema/*/resolvers/`に処理を書いていく

### フロントエンド
