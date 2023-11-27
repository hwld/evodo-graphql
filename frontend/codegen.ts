import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',
  documents: ['src/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/validator.ts': {
      // introspectionではフィールドに適用されてるディレクティブの情報が取得できないので、
      // バックエンドから直接graphqlスキーマを読み込んでディレクティブの情報を取得する
      schema: '../backend/src/schema/**/schema.graphql',
      plugins: ['typescript-validation-schema'],
      config: {
        importFrom: './generated/graphql',
        strictScalars: true,
        scalarSchemas: {
          ID: 'string',
        },
        schema: 'zod',
        directives: {
          constraint: {
            minLength: 'min',
            maxLength: 'max',
          },
        },
      },
    },
    './src/gql/generated/': {
      preset: 'client',
    },
  },
};

export default config;
