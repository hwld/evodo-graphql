import { createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import { typeDefs } from './schema/typeDefs.generated';
import { resolvers } from './schema/resolvers.generated';
import { yogaContext } from './schema/context';
import {
  constraintDirectiveTypeDefs,
  createEnvelopQueryValidationPlugin,
} from 'graphql-constraint-directive';

const yoga = createYoga({
  schema: createSchema({
    typeDefs: [constraintDirectiveTypeDefs, typeDefs],
    resolvers,
  }),
  context: yogaContext,
  plugins: [createEnvelopQueryValidationPlugin()],
});
const server = createServer(yoga);
server.listen(4000);
