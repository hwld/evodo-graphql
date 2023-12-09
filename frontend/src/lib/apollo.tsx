import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as ApolloProviderInternal,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ReactNode } from "react";
import { firebaseAuth } from "./firebase";
import { Task } from "@/gql/graphql";
import { relayStylePagination } from "@apollo/client/utilities";
import { TaskMemosQuery } from "@/app/tasks/task-sheet/task-memo-list";
import { isSameQueryName } from "./utils";

const httpLink = createHttpLink({ uri: "http://localhost:4000/graphql" });

const authLink = setContext(async (_, { headers }) => {
  const token = await firebaseAuth.currentUser?.getIdToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    ["Task" satisfies Task["__typename"]]: {
      fields: {
        ["memos" satisfies keyof Task]: {
          ...relayStylePagination(),
        },
      },
    },
  },
});

export const client = new ApolloClient({
  connectToDevTools: process.env.NODE_ENV === "development",
  link: authLink.concat(httpLink),
  cache,
  defaultOptions: {
    mutate: {
      update: (cache) => {
        cache.reset();
      },
      onQueryUpdated: (query) => {
        // TaskMemosQueryは無限スクロールを実装しているので、refetchすると1ページ目だけが
        // フェッチされてしまうため、ここでは無視する
        if (
          isSameQueryName({
            document: TaskMemosQuery,
            queryName: query.queryName,
          })
        ) {
          return false;
        }

        query.refetch();
      },
    },
  },
});

export const ApolloProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <ApolloProviderInternal client={client}>{children}</ApolloProviderInternal>
  );
};
