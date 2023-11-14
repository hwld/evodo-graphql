"use client";

import { Client, Provider, cacheExchange, fetchExchange } from "urql";

const urqlClient = new Client({
  url: "http://localhost:4000/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider value={urqlClient}>{children}</Provider>;
};
