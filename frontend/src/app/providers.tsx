'use client';

import { UrqlProvider } from '@/lib/urql';

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <UrqlProvider>{children}</UrqlProvider>;
};
