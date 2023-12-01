'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { ScrollArea } from './scroll-area';

type Props = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  width?: number;
  children: ReactNode;
};

export const Sheet: React.FC<Props> = ({
  open,
  onOpenChange,
  width = 600,
  children,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40 bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                className="fixed bottom-[15px] right-[15px] top-[15px] z-50 rounded-lg bg-neutral-100 shadow transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                style={{ width }}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
              >
                <ScrollArea className="h-full">
                  <Dialog.Close className="absolute right-3 top-3 rounded ring-offset-neutral-200 transition-all hover:bg-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2">
                    <XIcon />
                  </Dialog.Close>
                  <div className="p-8">{children}</div>
                </ScrollArea>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
