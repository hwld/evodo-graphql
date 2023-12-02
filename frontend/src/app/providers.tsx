'use client';

import { ApolloProvider } from '@/lib/apollo';
import { UrqlProvider } from '@/lib/urql';

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ApolloProvider>
      <UrqlProvider>{children}</UrqlProvider>
    </ApolloProvider>
  );
};
