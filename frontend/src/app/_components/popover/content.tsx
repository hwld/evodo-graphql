import { ReactNode } from 'react';
import { usePopoverContext } from './provider';
import { AnimatePresence } from 'framer-motion';

type Props = { children: ReactNode };
export const _Content: React.FC<Props> = ({ children }) => {
  const { isOpen, setFloating, floatingStyles } = usePopoverContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <div ref={setFloating} style={floatingStyles}>
          {children}
        </div>
      )}
    </AnimatePresence>
  );
};
