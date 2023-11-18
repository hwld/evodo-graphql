import { firebaseAuth, googleAuthProvider } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useEffect, useMemo, useState } from "react";

export const useAuth = () => {
  const [_loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loggedInUser = useMemo(() => {
    //　ログイン中はnullを返す
    if (isLoggedIn) {
      return null;
    }
    return _loggedInUser;
  }, [_loggedInUser, isLoggedIn]);

  const signIn = async () => {
    try {
      // ログイン後にtokenをAPIに投げて、新規登録化を判断するためpopupを使用する。
      // redirectでもできないことはないが、getRedirectResultを使って結果を取得する必要があり、
      // getRedirectResultに時間がかかるのでpopupを使用する。
      setIsLoggedIn(true);
      const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const accessToekn = await result.user.getIdToken();

      // ここで新規登録かを問い合わせて、新規登録であれば専用のページに飛ばす
      await new Promise((r) => setTimeout(() => r(undefined), 2000));
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

  const _signOut = () => {
    signOut(firebaseAuth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setLoggedInUser(user);
    });

    return () => unsubscribe();
  }, []);

  return { session: loggedInUser, signIn, signOut: _signOut, isLoggedIn };
};
