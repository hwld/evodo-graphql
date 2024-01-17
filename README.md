<img src="https://raw.githubusercontent.com/hwld/evodo-graphql/main/images/evodo-graphql.png" alt="screenshot" >

# evodo-graphql

GraphQL を試すために作る [evodo](https://github.com/hwld/evodo)。  


## 使用する技術

- GraphQL Yoga
- apollo-client
- Next.js
- TypeScript
- pnpm
- firebase

## 開発の進め方

忘れないように記録しておく

### 共通

- プロジェクトのルートで`pnpm dev`を実行する(frontend,backend の codegen,dev が混ざるので分けたければ別で実行する)
- **GraphQL 関連の修正を行ったら GraphQL LSP を手動で restart する**
  - 修正しても VSCode 上でエラーが出る、補完が効かないときは大抵 restart を忘れてる
  - どうにかならないんだろうか・・・

### バックエンド

- `src/schema/`の graphql ファイルを編集して、自動生成された`src/schema/*/resolvers/`に処理を書いていく

### フロントエンド
