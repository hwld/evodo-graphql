import { graphql } from "@/gql";
import { firebaseAuth, googleAuthProvider } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import { signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "urql";
import { useFirebaseAuthState } from "./useFirebaseAuthState";
import { Routes } from "@/lib/routes";

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

export const useAuth = () => {
  const router = useRouter();
  const {
    firebaseAuthState: { user: firebaseUser },
  } = useFirebaseAuthState();
  const [{ data }] = useQuery({
    query: UserQuery,
    variables: { id: firebaseUser?.uid! },
    pause: firebaseUser?.uid === undefined,
    requestPolicy: "network-only",
  });
  const [, initializeSignupIfNew] = useMutation(InitializeSignupIfNewMutation);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async () => {
    setIsLoggedIn(true);

    try {
      // ログイン後にtokenをAPIに投げて、新規登録かを判断するためpopupを使用する。
      // redirectでもできないことはないが、getRedirectResultを使って結果を取得する必要があり、
      // getRedirectResultに時間がかかるのでpopupを使用する。
      const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const idToken = await result.user.getIdToken();

      const initializeResult = await initializeSignupIfNew({
        input: {
          firebaseToken: idToken,
          name: result.user.displayName,
          avatarUrl: result.user.photoURL,
        },
      });

      // 新規登録であれば新規登録ページにリダイレクトさせる
      if (initializeResult.data?.initializeSignupIfNew?.isNewUser) {
        router.push(Routes.signUp);
      }
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

  return { loggedInUser: data?.user, login, logout, isLoggedIn };
};
