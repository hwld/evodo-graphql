"use client";

import { authExchange } from "@urql/exchange-auth";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import { authExchangeInit } from "./auth";
import { useMemo } from "react";
import { useFirebaseAuthState } from "@/hooks/useFirebaseAuthState";

export const UrqlProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { firebaseAuthState: firebaseAuthState } = useFirebaseAuthState();
  const client = useMemo(() => {
    return new Client({
      url: "http://localhost:4000/graphql",
      exchanges: [
        cacheExchange,
        authExchange((utils) =>
          authExchangeInit(utils, firebaseAuthState.user),
        ),
        fetchExchange,
      ],
    });
  }, [firebaseAuthState]);

  return <Provider value={client}>{children}</Provider>;
};
