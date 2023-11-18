import { AuthConfig, AuthUtilities } from "@urql/exchange-auth";
import { firebaseAuth } from "./firebase";

export const authExchangeInit: (
  utils: AuthUtilities
) => Promise<AuthConfig> = async (utils) => {
  let token: string | undefined = await firebaseAuth.currentUser?.getIdToken();

  return {
    willAuthError: () => {
      // リクエストのたびにトークンを更新したいので常にtrueを返す
      return true;
    },
    refreshAuth: async () => {
      token = await firebaseAuth.currentUser?.getIdToken();
    },
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
  };
};
