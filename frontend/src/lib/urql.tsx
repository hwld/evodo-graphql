"use client";

import { authExchange } from "@urql/exchange-auth";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import { authExchangeInit } from "./auth";

const urqlClient = new Client({
  url: "http://localhost:4000/graphql",
  exchanges: [cacheExchange, authExchange(authExchangeInit), fetchExchange],
});

export const UrqlProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider value={urqlClient}>{children}</Provider>;
};
