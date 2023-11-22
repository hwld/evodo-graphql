"use client";

import { useSession } from "@/hooks/useSession";

type Props = {};
export const UserAuthArea: React.FC<Props> = () => {
  const { loggedInUser, logout } = useSession();

  return (
    <div className="flex h-[50px] items-center rounded-lg bg-neutral-900 px-3 text-neutral-200">
      {loggedInUser && (
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-1">
            {loggedInUser.name}
            <span className="text-xs text-neutral-300">さん</span>
          </div>
          <button
            onClick={logout}
            className="rounded bg-neutral-200 px-3 py-1 text-neutral-700 transition-all hover:bg-neutral-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2
            focus-visible:ring-offset-neutral-900"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
};
