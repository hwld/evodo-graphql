import { createSchema, createYoga } from 'graphql-yoga';
import { typeDefs } from '../schema/typeDefs.generated';
import { resolvers } from '../schema/resolvers.generated';
import {
  HTTPExecutorOptions,
  buildHTTPExecutor,
} from '@graphql-tools/executor-http';
import { AsyncExecutor } from '@graphql-tools/utils';
import { parse } from 'graphql';
import { CustomContext } from '../schema/context';

const testYoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
});

export const executor = buildHTTPExecutor({
  fetch: testYoga.fetch,
}) as AsyncExecutor<CustomContext, HTTPExecutorOptions>;
export const gql = parse;

export function assertSingleValue<TValue extends object>(
  value: TValue | AsyncIterable<TValue>,
): asserts value is TValue {
  if (Symbol.asyncIterator in value) {
    throw new Error('Expected single value');
  }
}
