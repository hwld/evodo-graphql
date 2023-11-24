import { createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import { typeDefs } from './schema/typeDefs.generated';
import { resolvers } from './schema/resolvers.generated';
import { yogaContext } from './schema/context';

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: yogaContext,
});
const server = createServer(yoga);
server.listen(4000);
