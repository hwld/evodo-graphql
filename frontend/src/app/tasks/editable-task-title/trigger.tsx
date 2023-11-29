import { ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useEditableTaskTitle } from './root';

type Props = { children: ReactNode; asChild?: boolean };

export const _Trigger: React.FC<Props> = ({ children, asChild }) => {
  const { enableEditing } = useEditableTaskTitle();

  const Component = asChild ? Slot : 'button';
  return <Component onClick={enableEditing}>{children}</Component>;
};
