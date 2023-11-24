'use client';

import { graphql } from '@/gql';
import { useFirebaseAuthState } from '@/hooks/useFirebaseAuthState';
import { preventDefaultEnter } from '@/lib/preventDefault';
import { Routes } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useMutation } from 'urql';

const SignupMutation = graphql(`
  mutation SignupMutation($input: SignupInput!) {
    signup(input: $input) {
      user {
        id
      }
    }
  }
`);

type SignupFormData = {
  username: string;
  profile: string;
};

type Props = {
  defaultValues: Partial<SignupFormData>;
  isLoading: boolean;
};

export const SignupForm: React.FC<Props> = ({ defaultValues, isLoading }) => {
  const router = useRouter();
  const { firebaseAuthState } = useFirebaseAuthState();
  const [{ fetching }, signup] = useMutation(SignupMutation);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<SignupFormData>({
    username: defaultValues.username ?? '',
    profile: defaultValues.profile ?? '',
  });

  const handleSignup = async (e: SyntheticEvent) => {
    e.preventDefault();

    const token = await firebaseAuthState.user?.getIdToken();
    if (!token) {
      return;
    }

    const result = await signup({
      input: {
        firebaseToken: token,
        name: formData.username,
        profile: formData.profile,
      },
    });

    if (result.error) {
      window.alert('新規登録できませんでした。');
      return;
    }

    router.replace(Routes.home);
  };

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSignup} className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="name">ユーザー名</label>
        <input
          ref={nameInputRef}
          type="text"
          id="name"
          name="name"
          className="rounded border border-neutral-300 bg-neutral-100 px-3 py-2 transition-all
          placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500
          focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.username}
          disabled={isLoading}
          placeholder="ユーザー名を入力してください..."
          onChange={(e) => {
            setFormData((data) => ({
              ...data,
              username: e.target.value,
            }));
          }}
          onKeyDown={preventDefaultEnter}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="profile">プロフィール</label>
        <textarea
          id="profile"
          name="profile"
          className="min-h-[150px] resize-none rounded border border-neutral-300 bg-neutral-100 px-3 py-2 transition-all
          placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.profile}
          placeholder="プロフィールを入力してください..."
          disabled={isLoading}
          onChange={(e) => {
            setFormData((data) => ({
              ...data,
              profile: e.target.value,
            }));
          }}
        />
      </div>
      <button
        className="self-center rounded bg-neutral-800 px-4 py-2 text-neutral-100 transition-all
         hover:bg-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2
         disabled:pointer-events-none disabled:opacity-50"
        disabled={fetching || isLoading}
      >
        Evodoをはじめる
      </button>
    </form>
  );
};
