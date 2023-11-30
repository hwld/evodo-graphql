import * as RadixDialog from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import { ReactNode } from 'react';

type DialogProps = {
  height: number;
  isOpen: boolean;
  onChangeIsOpen: (value: boolean) => void;
  title: string;
  content: ReactNode;
  cancelButton: ReactNode;
  actionButton: ReactNode;
};

export const Dialog: React.FC<DialogProps> = ({
  height,
  isOpen,
  onChangeIsOpen,
  title,
  content,
  cancelButton,
  actionButton,
}) => {
  return (
    <RadixDialog.Root open={isOpen} onOpenChange={onChangeIsOpen}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className="data-[state=open]:animate-dialogOverlayEnter data-[state=closed]:animate-dialogOverlayExit
            fixed inset-0 z-40 bg-black/30"
        />
        <RadixDialog.Content
          className="data-[state=open]:animate-dialogEnter data-[state=closed]:animate-dialogExit fixed 
            inset-0 left-[50%] top-[50%] z-50 w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-neutral-100
            p-5 text-neutral-700"
          style={{ height }}
        >
          <RadixDialog.Close
            className="absolute right-3 top-3 rounded p-1 transition-all
            hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500
              focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100"
          >
            <XIcon />
          </RadixDialog.Close>
          <RadixDialog.Title className="text-xl font-bold">
            {title}
          </RadixDialog.Title>
          <RadixDialog.Description className="mt-5" asChild>
            {content}
          </RadixDialog.Description>
          <div
            className="absolute bottom-0 left-0 flex w-full justify-between gap-2 rounded-b-lg border-t
            border-neutral-300 bg-neutral-200/30 p-3"
          >
            <RadixDialog.Close asChild>{cancelButton}</RadixDialog.Close>
            {actionButton}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
