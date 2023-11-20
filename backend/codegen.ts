import type { CodegenConfig } from "@graphql-codegen/cli";
import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files";

const config: CodegenConfig = {
  schema: "**/schema.graphql",
  // resolverなどの実装ファイルも自動生成されるのでformatさせる
  hooks: { afterOneFileWrite: ["prettier --write"] },
  generates: {
    "src/schema": defineConfig({
      typesPluginsConfig: { contextType: "./context#Context" },
    }),
  },
};
export default config;
