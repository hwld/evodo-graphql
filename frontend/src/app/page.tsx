'use client';

import { useSession } from '@/hooks/useSession';
import { Routes } from '@/lib/routes';
import { redirect } from 'next/navigation';

const HomePage: React.FC = () => {
  const { status } = useSession();

  if (status === 'loading') {
    return <div>loading...</div>;
  }

  if (status === 'unauthenticated') {
    redirect(Routes.login);
  }
  redirect(Routes.home);
};

export default HomePage;
