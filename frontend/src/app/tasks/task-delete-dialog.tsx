import * as Dialog from "@radix-ui/react-dialog";
import { TrashIcon, XIcon } from "lucide-react";

type Props = {
  onDeleteTask: () => Promise<"success" | "error">;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  deleting: boolean;
};

export const TaskDeleteDialog: React.FC<Props> = ({
  onDeleteTask,
  isOpen,
  onOpenChange,
  deleting,
}) => {
  const handleDeleteTask = async () => {
    const result = await onDeleteTask();

    if (result === "success") {
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="data-[state=open]:animate-dialogOverlayEnter data-[state=closed]:animate-dialogOverlayExit
      fixed inset-0 bg-black/30"
        />
        <Dialog.Content
          className="data-[state=open]:animate-dialogEnter data-[state=closed]:animate-dialogExit fixed 
        inset-0 left-[50%] top-[50%] h-[250px] w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-neutral-100 p-5
        text-neutral-700"
        >
          <Dialog.Close
            className="absolute right-3 top-3 rounded p-1 transition-all
      hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500
      focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100"
          >
            <XIcon />
          </Dialog.Close>
          <Dialog.Title className="text-xl font-bold">
            タスクの削除
          </Dialog.Title>
          <Dialog.Description className="mt-5" asChild>
            <p>
              タスクを削除すると、元に戻すことはできません。
              <br />
              削除しますか？
            </p>
          </Dialog.Description>
          <div
            className="absolute bottom-0 left-0 flex w-full justify-between gap-2 rounded-b-lg border-t
         border-neutral-300 bg-neutral-200/30 p-3"
          >
            <Dialog.Close asChild>
              <button
                className="rounded border border-neutral-300 bg-neutral-100 px-3 py-1 text-neutral-700
          transition-all hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500
          focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-200"
              >
                キャンセル
              </button>
            </Dialog.Close>
            <button
              className="flex items-center gap-1 rounded bg-neutral-900 px-3 py-2 text-neutral-100 transition-all
          hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500
          focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-200 disabled:pointer-events-none disabled:opacity-50"
              onClick={handleDeleteTask}
              disabled={deleting}
            >
              <TrashIcon size={20} />
              削除する
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
