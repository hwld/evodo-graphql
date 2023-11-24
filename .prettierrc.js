/** @type {import("prettier").Config} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx'],
  tabWidth: 2,
  semi: true,
  // graphqlのresolver-filesがシングルクォートを使ってるのでそっちに合わせてみる
  singleQuote: true,
};

module.exports = config;
