import { CodegenConfig } from '@graphql-codegen/cli';

const scalarConfig = { strictScalars: true, scalars: { DateTime: 'string' } };

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
        ...scalarConfig,
        importFrom: './graphql',
        schema: 'zod',
        directives: {
          constraint: {
            minLength: ['min', '$1', '必須項目です。'],
            maxLength: ['max', '$1', '最大で$1文字です。'],
          },
        },
      },
    },
    './src/gql/': {
      preset: 'client',
      config: {
        ...scalarConfig,
      },
    },
  },
};

export default config;
