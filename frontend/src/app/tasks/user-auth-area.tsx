"use client";

import { useSession } from "@/hooks/useSession";

type Props = {};
export const UserAuthArea: React.FC<Props> = () => {
  const { loggedInUser, logout } = useSession();

  return (
    <div>
      {loggedInUser && (
        <div className="flex gap-2 items-center">
          <div>{loggedInUser.name}がログインしています</div>
          <button onClick={logout} className="bg-neutral-300 py-1 px-3 rounded">
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
};
