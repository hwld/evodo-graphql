"use client";

import { useAuth } from "@/hooks/useAuth";

type Props = {};
export const UserAuthArea: React.FC<Props> = () => {
  const { session, signIn, signOut } = useAuth();

  return (
    <div>
      {session ? (
        <div className="flex gap-2 items-center">
          <div>ID: {session.user.id} がログインしています。</div>
          <button
            onClick={signOut}
            className="bg-neutral-300 py-1 px-3 rounded"
          >
            ログアウト
          </button>
        </div>
      ) : (
        <button onClick={signIn} className="bg-neutral-300 py-1 px-3 rounded">
          ログイン
        </button>
      )}
    </div>
  );
};
