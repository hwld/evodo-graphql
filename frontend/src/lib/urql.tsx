"use client";

import { authExchange } from "@urql/exchange-auth";
import { Client, Provider, cacheExchange, fetchExchange } from "urql";
import { auth } from "./firebase";

const urqlClient = new Client({
  url: "http://localhost:4000/graphql",
  exchanges: [
    cacheExchange,
    // リクエストごとにtokenを取得する方法がなさそう？
    // https://github.com/urql-graphql/urql/discussions/2647#discussioncomment-3501919
    // event-emitterを使った解決策が紹介されてるけど、無駄に複雑になりそうな気がしてる。
    // apollo-clientだとリクエストごとにAuthorizationヘッダ付与できるっぽいし、そっち使おうかな・・・。
    authExchange(async (utils) => {
      const token = await auth.currentUser?.getIdToken();

      return {
        addAuthToOperation: (operation) => {
          if (!token) {
            return operation;
          }

          return utils.appendHeaders(operation, {
            AUthorization: `Bearer ${token}`,
          });
        },
        didAuthError: (error, _operation) => {
          // TODO
          return false;
        },
        refreshAuth: async () => {
          await auth.signOut();
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
