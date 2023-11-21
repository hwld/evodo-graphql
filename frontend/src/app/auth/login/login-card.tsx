import { useSession } from "@/hooks/useSession";
import { Routes } from "@/lib/routes";
import { CopyCheckIcon } from "lucide-react";
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
    <div className="rounded-2xl border-2 border-neutral-300 bg-neutral-100 p-16">
      <div className="flex max-w-[300px] flex-col items-center">
        <div className="flex flex-col items-center gap-1">
          <CopyCheckIcon size={100} />
          <p className="text-3xl">evodo-graphql</p>
        </div>
        <p className="mt-5">
          GraphQLで作られた、ついタスクを追加したくなるようなTodoリストです。
        </p>
        <button
          className="group mt-14 flex w-full items-center justify-between rounded-lg border-2 border-neutral-300 px-3 py-2 
          transition-all hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500
          focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50"
          onClick={handleLogin}
          disabled={isLoggedIn}
        >
          <div className="flex items-center gap-2">
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
        <div className="mt-5">
          <p className="flex items-start text-xs text-neutral-500">
            <span className="text-xl">・</span>
            ログイン、新規登録どちらも上のボタンから行うことができます。
          </p>
          <p className="mt-2 flex items-start text-xs text-neutral-500">
            <span className="text-xl">・</span>
            ポップアップを閉じるともう一度開けるようになるまで時間がかかります。
          </p>
        </div>
      </div>
    </div>
  );
};
