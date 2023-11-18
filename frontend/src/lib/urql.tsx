"use client";

import { authExchange } from "@urql/exchange-auth";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import { authExchangeInit } from "./auth";
import { useMemo } from "react";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

export const UrqlProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { firebaseUser } = useFirebaseUser();
  const client = useMemo(() => {
    return new Client({
      url: "http://localhost:4000/graphql",
      exchanges: [
        cacheExchange,
        authExchange((utils) => authExchangeInit(utils, firebaseUser.idToken)),
        fetchExchange,
      ],
    });
  }, [firebaseUser]);

  return <Provider value={client}>{children}</Provider>;
};
