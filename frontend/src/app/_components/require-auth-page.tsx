"use client";

import { useSession } from "@/app/_hooks/useSession";
import { Routes } from "@/lib/routes";
import { redirect } from "next/navigation";
import { Spinner } from "./spinner";
import { AppLogo } from "./app-logo";

type Props = { children: React.ReactNode };

export const RequireAuthPage: React.FC<Props> = ({ children }) => {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="-mt-[50px] flex h-[100dvh] w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-lg bg-neutral-900">
            <AppLogo size={75} />
          </div>
          <Spinner />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect(Routes.login);
  }

  return children;
};
