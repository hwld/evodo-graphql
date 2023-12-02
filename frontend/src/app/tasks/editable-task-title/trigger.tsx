import { ReactNode, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { useEditableTaskTitle } from './root';

type Props = { children: ReactNode; asChild?: boolean };

export const _Trigger: React.FC<Props> = forwardRef<HTMLButtonElement, Props>(
  function _Trigger({ children, asChild }, ref) {
    const { enableEditing } = useEditableTaskTitle();

    const Component = asChild ? Slot : 'button';
    return (
      <Component ref={ref} onClick={enableEditing}>
        {children}
      </Component>
    );
  },
);
