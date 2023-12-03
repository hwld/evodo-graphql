"use client";

import { Button } from "@/app/_components/button";
import { Input } from "@/app/_components/input";
import { Textarea } from "@/app/_components/textarea";
import { graphql } from "@/gql";
import { useFirebaseAuthState } from "@/app/_hooks/useFirebaseAuthState";
import { Routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupInputSchema } from "@/gql/validator";
import { z } from "zod";
import { PowerIcon } from "lucide-react";
import { useMutation } from "@apollo/client";
import { noop } from "@/lib/utils";

const SignupMutation = graphql(`
  mutation SignupMutation($input: SignupInput!) {
    signup(input: $input) {
      user {
        id
      }
    }
  }
`);

const signupInputSchema = SignupInputSchema().omit({ firebaseToken: true });
type SignupInput = z.infer<typeof signupInputSchema>;

type Props = {
  defaultValues: Partial<SignupInput>;
  isLoading: boolean;
};

export const SignupForm: React.FC<Props> = ({ defaultValues, isLoading }) => {
  const router = useRouter();
  const { firebaseAuthState } = useFirebaseAuthState();
  const [signup, { loading }] = useMutation(SignupMutation);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit: _handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    defaultValues: { name: "", profile: "", avatarUrl: "", ...defaultValues },
    resolver: zodResolver(signupInputSchema),
  });

  const internalIsLoading = isLoading || loading;

  const handleSignup = _handleSubmit(async ({ name, profile, avatarUrl }) => {
    const token = await firebaseAuthState.user?.getIdToken();
    if (!token) {
      return;
    }

    const result = await signup({
      variables: {
        input: {
          firebaseToken: token,
          name: name,
          profile: profile,
          avatarUrl: avatarUrl,
        },
      },
      onError: noop,
    });

    if (result.errors) {
      window.alert("新規登録できませんでした。");
      return;
    }

    router.replace(Routes.home);
  });

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSignup} className="flex w-full flex-col gap-3">
      <fieldset disabled={internalIsLoading}>
        <Input
          label="ユーザー名"
          id="name"
          autoComplete="off"
          placeholder="ユーザー名を入力してください..."
          {...register("name")}
          error={errors.name?.message}
        />
        <Textarea
          id="profile"
          label="プロフィール"
          placeholder="プロフィールを入力してください..."
          {...register("profile")}
          error={errors.profile?.message}
        />
        <div className="self-center">
          <Button
            disabled={internalIsLoading}
            debouncedIsLoading={internalIsLoading}
            leftIcon={PowerIcon}
          >
            Evodoをはじめる
          </Button>
          <div className="mt-1" />
        </div>
      </fieldset>
    </form>
  );
};
