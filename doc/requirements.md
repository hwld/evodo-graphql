# 要件

## 機能

- タスクを作成できる
- タスクを削除できる
- タスクを達成・未達成に変更できる
- タスク名を変更できる
- Google アカウントでログインできる
- 初めてログインしたときに新規登録ページでプロフィールを編集できる
- タスクの詳細を確認できる
- タスクの説明を編集できる
- タスクにメモを残せる
- タスクメモのページング機能
  - (GraphQLでカーソルベースページネーションを実装したくて作ったが、必要なさそう・・・)

## 非機能

- ページを訪れたらすぐにタスクを作成できる
- ログインしなければ使えない

# ページ

| ページ名     | URL          | できること                         |
| ------------ | ------------ | ---------------------------------- |
| タスクの一覧 | /tasks       | タスクの一覧表示、作成、更新、削除 |
| ログイン     | /auth/login  | ログイン                           |
| 新規登録     | /auth/signup | ユーザーの新規登録                 |
