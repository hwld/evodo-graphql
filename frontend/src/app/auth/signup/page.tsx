'use client';

import { SignupForm } from './signup-form';
import { graphql } from '@/gql';
import { useFirebaseAuthState } from '@/hooks/useFirebaseAuthState';
import { Routes } from '@/lib/routes';
import { HandMetalIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from 'urql';

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
    requestPolicy: 'network-only',
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
    draftUserResult.fetching ||
    draftUserResult.error
  );

  return (
    <div className="p-14">
      <div className="m-auto flex max-w-lg flex-col items-center">
        <h1 className="text-3xl font-bold">Welcome</h1>
        <div className="mt-5 flex w-full gap-5 rounded-lg bg-neutral-800 p-10 text-neutral-300">
          <HandMetalIcon size={120} />
          <HandMetalIcon size={120} />
          <HandMetalIcon size={120} />
        </div>

        <div className="mt-10 w-full">
          <SignupForm
            defaultValues={{ username: draftUserResult.data?.draftUser?.name }}
            isLoading={isLoading}
            // ローディング状態が変わったときにdefaultValuesをリセットする
            // 入力途中でリセットされちゃうことってある？
            key={String(isLoading)}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
