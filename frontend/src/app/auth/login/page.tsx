"use client";

import { useSession } from "@/hooks/useSession";
import { Routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SigninPage: React.FC = () => {
  const { login } = useSession();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggedIn(true);
    try {
      const loginResult = await login();

      if (loginResult.cancelled) {
        return;
      }

      if (loginResult.isNewUser) {
        router.push(Routes.signUp);
      } else {
        router.replace(Routes.home);
      }
    } finally {
      setIsLoggedIn(false);
    }
  };

  return (
    <div className="h-[100dvh] flex justify-center items-center">
      <button
        onClick={handleLogin}
        className="px-3 py-2 bg-neutral-300 rounded disabled:bg-neutral-400 disabled:text-neutral-300"
        disabled={isLoggedIn}
      >
        ログインする
      </button>
    </div>
  );
};

export default SigninPage;
