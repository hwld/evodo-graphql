"use client";

import { ApolloProvider } from "@/lib/apollo";
import { ToastProvider } from "./_components/toast";

export const Providers: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ApolloProvider>
      <ToastProvider>{children}</ToastProvider>
    </ApolloProvider>
  );
};
