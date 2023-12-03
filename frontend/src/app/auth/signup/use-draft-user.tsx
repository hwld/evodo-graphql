import { graphql } from "@/gql";
import { useFirebaseAuthState } from "@/app/_hooks/useFirebaseAuthState";
import { Routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";

const DraftUserQuery = graphql(`
  query DraftUserQuery {
    draftUser {
      name
    }
  }
`);

export const useDraftUser = () => {
  const router = useRouter();
  const { firebaseAuthState } = useFirebaseAuthState();
  const draftUserResult = useQuery(DraftUserQuery, {
    skip: !firebaseAuthState.user,
  });

  // firebaeで認証していない場合はリダイレクト
  // draftUserが存在しない場合はリダイレクト
  useEffect(() => {
    if (
      (!firebaseAuthState.isLoading && !firebaseAuthState.user) ||
      draftUserResult.error
    ) {
      router.replace(Routes.home);
    }
  }, [
    firebaseAuthState.user,
    firebaseAuthState.isLoading,
    router,
    draftUserResult.error,
  ]);

  // firebaseの認証情報を確認してるか、認証情報がない場合はloading
  // draftUserをフェッチ中か、draftUserが無い場合はloading
  const isLoading = !!(
    firebaseAuthState.isLoading ||
    !firebaseAuthState.user ||
    draftUserResult.loading ||
    draftUserResult.error
  );

  return { isLoading, draftUser: draftUserResult.data?.draftUser };
};
