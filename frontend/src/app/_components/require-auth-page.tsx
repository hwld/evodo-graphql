'use client';

import { useSession } from '@/hooks/useSession';
import { Routes } from '@/lib/routes';
import { redirect } from 'next/navigation';
import { CopyCheckIcon } from 'lucide-react';
import { Spinner } from './spinner';

type Props = { children: React.ReactNode };

export const RequireAuthPage: React.FC<Props> = ({ children }) => {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="-mt-[50px] flex h-[100dvh] w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <CopyCheckIcon size={100} strokeWidth={2} />
          <Spinner />
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect(Routes.login);
  }

  return children;
};
