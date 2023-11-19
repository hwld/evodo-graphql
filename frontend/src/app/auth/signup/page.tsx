"use client";

import { SignupForm } from "./signup-form";
import { graphql } from "@/gql";
import { useFirebaseAuthState } from "@/hooks/useFirebaseAuthState";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "urql";

const DraftUserQuery = graphql(`
  query DraftUserQuery {
    draftUser {
      name
    }
  }
`);

const SignupPage: React.FC = () => {
  const router = useRouter();
  const { firebaseAuthState } = useFirebaseAuthState();
  const [draftUserResult] = useQuery({
    query: DraftUserQuery,
    pause: !firebaseAuthState.user,
    requestPolicy: "network-only",
  });

  // firebaeで認証していない場合はリダイレクト
  // draftUserが存在しない場合はリダイレクト
  useEffect(() => {
    if (
      (!firebaseAuthState.isLoading && !firebaseAuthState.user) ||
      draftUserResult.error
    ) {
      router.replace("/");
    }
  }, [
    firebaseAuthState.user,
    firebaseAuthState.isLoading,
    router,
    draftUserResult.error,
  ]);

  // firebaseの認証情報を確認してるか、認証情報がない場合はloadingを表示させる
  // draftUserをフェッチ中か、draftUserが無い場合はloadingを表示させる
  if (
    firebaseAuthState.isLoading ||
    !firebaseAuthState.user ||
    draftUserResult.fetching ||
    draftUserResult.error
  ) {
    return (
      <div className="h-[100dvh] bg-neutral-200 text-neutral-700">loading</div>
    );
  }

  return (
    <div className="h-[100dvh] bg-neutral-200 text-neutral-700 p-10">
      <div className="max-w-2xl m-auto flex flex-col gap-3">
        <h1 className="text-xl">新規登録</h1>
        <SignupForm
          defaultValues={{ username: draftUserResult.data?.draftUser?.name }}
        />
      </div>
    </div>
  );
};

export default SignupPage;
