'use client';

import { useSession } from '@/hooks/useSession';
import { Button } from '../_components/button';

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
          <Button onClick={logout} color="white" size="sm">
            ログアウト
          </Button>
        </div>
      )}
    </div>
  );
};
