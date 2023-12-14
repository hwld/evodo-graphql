import { AppLogo } from "@/app/_components/app-logo";
import { useSession } from "@/app/_hooks/useSession";
import { Routes } from "@/lib/routes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {};

export const LoginCard: React.FC<Props> = () => {
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
    <div className="rounded-2xl border border-neutral-300 bg-neutral-100 p-16">
      <div className="flex max-w-[350px] flex-col items-center">
        <div className="flex w-full items-center justify-center gap-3">
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-lg bg-neutral-900">
            <AppLogo size={75} />
          </div>
          <p className="text-7xl font-bold text-neutral-900">evodo</p>
        </div>
        <p className="mt-10">
          すぐに始められるTodoリスト。
          <br />
          直感的なUIでストレスなくタスクを入力でき、日々のタスクを楽しく管理することができます。
        </p>
        <div className="mt-14">
          <p className="flex items-start text-sm text-neutral-400">
            <span className="text-xl">・</span>
            ログイン、新規登録どちらも下のボタンから行うことができます。
          </p>
          <p className="mt-2 flex items-start text-sm text-neutral-400">
            <span className="text-xl">・</span>
            ポップアップを閉じるともう一度開けるようになるまで時間がかかります。
          </p>
        </div>
        <button
          className="group mt-5 flex w-full items-center justify-between rounded-lg bg-neutral-800 px-4 py-3 text-neutral-100 
          transition-all hover:bg-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500
          focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          onClick={handleLogin}
          disabled={isLoggedIn}
        >
          <div className="flex w-full items-center justify-center gap-2">
            <Image
              src="/google-icon.svg"
              alt="google-icon"
              width={25}
              height={25}
            />
            <p>Googleでログイン</p>
          </div>
          <span className="h-5 w-5 animate-spin rounded-full border-[3px] border-neutral-400  border-t-transparent opacity-0 group-disabled:opacity-100"></span>
        </button>
      </div>
    </div>
  );
};
