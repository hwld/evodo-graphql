import { Provider } from 'jotai';
import { ReactNode } from 'react';

export const _Root: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <Provider>{children}</Provider>;
};
