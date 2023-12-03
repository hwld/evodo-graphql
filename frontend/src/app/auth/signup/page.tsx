"use client";

import { SignupForm } from "./signup-form";
import { HandMetalIcon } from "lucide-react";
import { useDraftUser } from "./use-draft-user";

const SignupPage: React.FC = () => {
  const { draftUser, isLoading } = useDraftUser();

  return (
    <div className="p-14">
      <div className="m-auto flex max-w-lg flex-col items-center">
        <h1 className="text-3xl font-bold">Welcome</h1>
        <div className="mt-5 flex h-[250px] w-full items-center  gap-5 rounded-lg bg-neutral-800 p-10 text-neutral-300">
          <HandMetalIcon size={120} />
          <HandMetalIcon size={120} />
          <HandMetalIcon size={120} />
        </div>

        <div className="mt-12 w-full">
          <SignupForm
            defaultValues={{
              name: draftUser?.name,
            }}
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
