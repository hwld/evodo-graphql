import type { IGraphQLConfig } from "graphql-config";
import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files";

const scalarConfig = { strictScalars: true, scalars: { DateTime: "string" } };

const config: IGraphQLConfig = {
  projects: {
    backend: {
      schema: "backend/src/**/schema.graphql",
      extensions: {
        codegen: {
          generates: {
            "backend/src/schema": defineConfig({
              typesPluginsConfig: { contextType: "./context#Context" },
            }),
          },
        },
      },
    },

    frontend: {
      schema: "backend/src/schema/**/schema.graphql",
      documents: ["frontend/src/**/*.tsx"],
      extensions: {
        codegen: {
          ignoreNoDocuments: true,
          generates: {
            "frontend/src/gql/validator.ts": {
              plugins: ["typescript-validation-schema"],
              config: {
                ...scalarConfig,
                importFrom: "./graphql",
                schema: "zod",
                directives: {
                  constraint: {
                    minLength: ["min", "$1", "必須項目です。"],
                    maxLength: ["max", "$1", "最大で$1文字です。"],
                  },
                },
              },
            },
            "frontend/src/gql/": {
              preset: "client",
              config: {
                ...scalarConfig,
              },
            },
          },
        },
      },
    },
  },
};

export default config;
