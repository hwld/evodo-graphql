"use client";

import { useAuth } from "@/hooks/useAuth";

type Props = {};
export const UserAuthArea: React.FC<Props> = () => {
  const { loggedInUser, signIn, signOut, isLoggedIn } = useAuth();

  return (
    <div>
      {loggedInUser ? (
        <div className="flex gap-2 items-center">
          <div>{loggedInUser.displayName} がログインしています。</div>
          <button
            onClick={signOut}
            className="bg-neutral-300 py-1 px-3 rounded"
          >
            ログアウト
          </button>
        </div>
      ) : (
        <button
          onClick={signIn}
          className="bg-neutral-300 py-1 px-3 rounded disabled:bg-neutral-900"
          disabled={isLoggedIn}
        >
          ログイン
        </button>
      )}
    </div>
  );
};
