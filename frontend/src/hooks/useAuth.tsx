import { graphql } from "@/gql";
import { firebaseAuth, googleAuthProvider } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { getAdditionalUserInfo, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "urql";
import { useFirebaseUser } from "./useFirebaseUser";

const UserQuery = graphql(`
  query UserQuery($id: ID!) {
    user(id: $id) {
      id
      name
      avatarUrl
    }
  }
`);

const SignUpMutation = graphql(`
  mutation SignUpMutation($input: SignUpInput!) {
    signUp(input: $input) {
      id
    }
  }
`);

export const useAuth = () => {
  const router = useRouter();

  const { firebaseUser } = useFirebaseUser();

  const [{ data }] = useQuery({
    query: UserQuery,
    variables: { id: firebaseUser.id! },
    pause: firebaseUser.id === undefined,
  });

  const [, signUp] = useMutation(SignUpMutation);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loggedInUser = useMemo(() => {
    if (firebaseUser.id === undefined) {
      return undefined;
    }
    return data?.user ?? undefined;
  }, [data?.user, firebaseUser.id]);

  const login = async () => {
    setIsLoggedIn(true);

    try {
      // ログイン後にtokenをAPIに投げて、新規登録化を判断するためpopupを使用する。
      // redirectでもできないことはないが、getRedirectResultを使って結果を取得する必要があり、
      // getRedirectResultに時間がかかるのでpopupを使用する。
      const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const idToken = await result.user.getIdToken();

      // 新規登録
      const isNew = getAdditionalUserInfo(result)?.isNewUser;
      if (isNew) {
        // 新規登録のエンドポイントを呼ぶ
        const signUpResult = await signUp({
          input: {
            firebaseToken: idToken,
            name: result.user.displayName,
            avatarUrl: result.user.photoURL,
          },
        });

        if (signUpResult.error) {
          window.alert("新規登録に失敗しました。もう一度試してください。");
          logout();
          return;
        }

        // TODO: 新規登録用のページにリダイレクトする？
        // router.push("/auth/init");
        return;
      }
      return;
    } catch (e) {
      // ポップアップを閉じたときにエラーが出るまでにタイムラグがあるのでloading状態が切れない時間が長い・・・
      if (e instanceof FirebaseError) {
        // ポップアップを閉じてもう一度開こうとするとエラーになるが、無視して問題なさそうなので無視する。
        // https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#error-codes_15
        if (
          e.code === "auth/popup-closed-by-user" ||
          e.code === "auth/cancelled-popup-request"
        ) {
          return;
        }
      }
      throw e;
    } finally {
      setIsLoggedIn(false);
    }
  };

  const logout = () => {
    signOut(firebaseAuth);
  };

  return { loggedInUser, login, logout, isLoggedIn };
};
