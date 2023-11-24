import { AuthConfig, AuthUtilities } from '@urql/exchange-auth';
import { firebaseAuth } from './firebase';

export const authExchangeInit: (
  utils: AuthUtilities,
) => Promise<AuthConfig> = async (utils) => {
  let token: String | undefined;

  return {
    // リクエスト毎にtoken取得したいので常にtrueを返してrefreshAuthを実行させる
    willAuthError: () => {
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
    didAuthError: () => {
      // TODO
      return false;
    },
  };
};
