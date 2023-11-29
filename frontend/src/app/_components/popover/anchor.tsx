import { Slot } from '@radix-ui/react-slot';
import { ReactNode } from 'react';
import { usePopoverContext } from './provider';

type Props = { children: ReactNode };
export const _Anchor: React.FC<Props> = ({ children }) => {
  const { setReference } = usePopoverContext();

  return <Slot ref={setReference}>{children}</Slot>;
};
