import { graphql } from '@/gql';
import { firebaseAuth, googleAuthProvider } from '@/lib/firebase';
import { FirebaseError } from 'firebase/app';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useQuery, useMutation } from '@apollo/client';
import { useFirebaseAuthState } from './useFirebaseAuthState';
import { useMemo } from 'react';
import { noop } from '@/lib/utils';

const UserQuery = graphql(`
  query UserQuery($id: ID!) {
    user(id: $id) {
      id
      name
      avatarUrl
    }
  }
`);

const InitializeSignupIfNewMutation = graphql(`
  mutation InitializeSignupIfNewMutation($input: InitializeSignupIfNewInput!) {
    initializeSignupIfNew(input: $input) {
      isNewUser
    }
  }
`);

export const useSession = () => {
  const {
    firebaseAuthState: { user: firebaseUser, isLoading: isFirebaseLoading },
  } = useFirebaseAuthState();

  const { data, loading: isUserLoading } = useQuery(UserQuery, {
    variables: { id: firebaseUser?.uid! },
    skip: firebaseUser?.uid === undefined,
  });

  const status = useMemo(() => {
    if (isFirebaseLoading || isUserLoading) {
      return 'loading';
    }
    // ログアウトするとここがundefinedになるが、dataはpauseされるのでundefinedにならないので
    // data.userのチェックの前にfirebaesUserが存在しないことを確認する必要がある
    if (!firebaseUser) {
      return 'unauthenticated';
    }
    if (data?.user) {
      return 'authenticated';
    }

    return 'unauthenticated';
  }, [data?.user, isUserLoading, firebaseUser, isFirebaseLoading]);

  const [initializeSignupIfNew] = useMutation(InitializeSignupIfNewMutation);

  type LoginResult =
    | { cancelled: false; isNewUser: boolean }
    | { cancelled: true };
  const login = async (): Promise<LoginResult> => {
    try {
      // ログイン後にtokenをAPIに投げて、新規登録かを判断するためpopupを使用する。
      // redirectでもできないことはないが、getRedirectResultを使って結果を取得する必要があり、
      // getRedirectResultに時間がかかるのでpopupを使用する。
      const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const idToken = await result.user.getIdToken();

      const { data } = await initializeSignupIfNew({
        variables: {
          input: {
            firebaseToken: idToken,
            name: result.user.displayName ?? '',
            avatarUrl: result.user.photoURL ?? '',
          },
        },
        onError: noop,
      });

      // 新規登録かどうか
      return {
        cancelled: false,
        isNewUser: data?.initializeSignupIfNew?.isNewUser ?? false,
      };
    } catch (e) {
      // ポップアップを閉じたときにエラーが出るまでにタイムラグがあるのでloading状態が切れない時間が長い・・・
      if (e instanceof FirebaseError) {
        // ポップアップを閉じてもう一度開こうとするとエラーになるが、無視して問題なさそうなので無視する。
        // https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#error-codes_15
        if (
          e.code === 'auth/popup-closed-by-user' ||
          e.code === 'auth/cancelled-popup-request'
        ) {
          return { cancelled: true };
        }
      }
      throw e;
    }
  };

  const logout = async () => {
    await signOut(firebaseAuth);
  };

  return {
    loggedInUser: data?.user,
    status,
    login,
    logout,
  } as const;
};
