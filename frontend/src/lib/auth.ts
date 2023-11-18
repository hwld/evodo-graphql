import { AuthConfig, AuthUtilities } from "@urql/exchange-auth";
import { User } from "firebase/auth";

export const authExchangeInit: (
  utils: AuthUtilities,
  loggedInUser: User | null
) => Promise<AuthConfig> = async (utils, loggedInUser) => {
  const token = await loggedInUser?.getIdToken();

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
