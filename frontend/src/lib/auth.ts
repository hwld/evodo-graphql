import { AuthConfig, AuthUtilities } from "@urql/exchange-auth";

export const authExchangeInit: (
  utils: AuthUtilities,
  token: string | undefined
) => Promise<AuthConfig> = async (utils, token) => {
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
