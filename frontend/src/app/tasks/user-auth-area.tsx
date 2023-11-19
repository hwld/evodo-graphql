"use client";

import { useAuth } from "@/hooks/useAuth";

type Props = {};
export const UserAuthArea: React.FC<Props> = () => {
  const { loggedInUser, login, logout, isLoggedIn } = useAuth();

  return (
    <div>
      {loggedInUser ? (
        <div className="flex gap-2 items-center">
          <div>{loggedInUser.name}がログインしています</div>
          <button onClick={logout} className="bg-neutral-300 py-1 px-3 rounded">
            ログアウト
          </button>
        </div>
      ) : (
        <button
          onClick={login}
          className="bg-neutral-300 py-1 px-3 rounded disabled:bg-neutral-900"
          disabled={isLoggedIn}
        >
          ログイン
        </button>
      )}
    </div>
  );
};
