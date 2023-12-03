import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as ApolloProviderInternal,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ReactNode } from "react";
import { firebaseAuth } from "./firebase";

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

export const client = new ApolloClient({
  connectToDevTools: process.env.NODE_ENV === "development",
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: {
      update: (cache) => {
        cache.reset();
      },
      onQueryUpdated: (query) => {
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
