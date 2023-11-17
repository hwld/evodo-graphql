"use client";

import { supabase } from "@/lib/supabase";
import { authExchange } from "@urql/exchange-auth";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";

const urqlClient = new Client({
  url: "http://localhost:4000/graphql",
  exchanges: [
    cacheExchange,
    authExchange(async (utils) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      return {
        addAuthToOperation: (operation) => {
          if (!session) {
            return operation;
          }

          return utils.appendHeaders(operation, {
            AUthorization: `Bearer ${session.access_token}`,
          });
        },
        didAuthError: (error, _operation) => {
          // TODO
          return false;
        },
        refreshAuth: async () => {
          await supabase.auth.signOut();
        },
      };
    }),
    fetchExchange,
  ],
});

export const UrqlProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider value={urqlClient}>{children}</Provider>;
};
