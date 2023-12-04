// graphql-configにdirectiveの定義を読み込ませるためのファイル
const {
  constraintDirectiveTypeDefs,
} = require("graphql-constraint-directive/lib/type-defs");

module.exports = constraintDirectiveTypeDefs;
