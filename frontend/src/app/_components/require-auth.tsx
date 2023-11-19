"use client";

import { useSession } from "@/hooks/useSession";
import { Routes } from "@/lib/routes";
import { redirect } from "next/navigation";

type Props = { children: React.ReactNode };

export const RequireAuth: React.FC<Props> = ({ children }) => {
  const { status } = useSession();

  if (status === "loading") {
    return <div>loading...</div>;
  }

  if (status === "unauthenticated") {
    redirect(Routes.login);
  }

  return children;
};
