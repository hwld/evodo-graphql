"use client";

import { graphql } from "@/gql";
import { useFirebaseAuthState } from "@/hooks/useFirebaseAuthState";
import { Routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { useMutation } from "urql";

const SignupMutation = graphql(`
  mutation SignupMutation($input: SignupInput!) {
    signup(input: $input) {
      id
    }
  }
`);

type SignupFormData = {
  username: string;
  profile: string;
};

type Props = {
  defaultValues: Partial<SignupFormData>;
};

export const SignupForm: React.FC<Props> = ({ defaultValues }) => {
  const router = useRouter();
  const { firebaseAuthState } = useFirebaseAuthState();
  const [{ fetching }, signup] = useMutation(SignupMutation);
  const [formData, setFormData] = useState<SignupFormData>({
    username: defaultValues.username ?? "",
    profile: defaultValues.profile ?? "",
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
      window.alert("新規登録できませんでした。");
      return;
    }

    router.replace(Routes.home);
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-5">
      <div className="flex flex-col">
        <label>ユーザー名</label>
        <input
          value={formData.username}
          onChange={(e) => {
            setFormData((data) => ({ ...data, username: e.target.value }));
          }}
        />
      </div>
      <div className="flex flex-col">
        <label>プロフィール</label>
        <textarea
          value={formData.profile}
          onChange={(e) => {
            setFormData((data) => ({ ...data, profile: e.target.value }));
          }}
        />
      </div>
      <button
        className="bg-neutral-300 px-3 py-2 self-start"
        disabled={fetching}
      >
        新規登録
      </button>
    </form>
  );
};
