"use client";

import { ApolloProvider } from "@/lib/apollo";

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ApolloProvider>{children}</ApolloProvider>;
};
