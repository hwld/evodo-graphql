import { AuthConfig, AuthUtilities } from "@urql/exchange-auth";
import { User } from "firebase/auth";

export const authExchangeInit: (
  utils: AuthUtilities,
  firebaseUser: User | undefined,
) => Promise<AuthConfig> = async (utils, user) => {
  const token = await user?.getIdToken();

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
    refreshAuth: async () => {},
  };
};
