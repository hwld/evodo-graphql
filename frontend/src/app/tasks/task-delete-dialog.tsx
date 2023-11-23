import * as Dialog from "@radix-ui/react-dialog";
import { TrashIcon, XIcon } from "lucide-react";
import { atom, useAtom, useSetAtom } from "jotai";
import { useTaskDelete } from "./use-task-delete";
import { useMemo } from "react";

type TaskDeleteDialogAtom =
  | { isOpen: true; taskId: string }
  | { isOpen: false; taskId: undefined };

const dialogAtom = atom<TaskDeleteDialogAtom>({
  isOpen: false,
  taskId: undefined,
});

export const useTaskDeleteDialog = () => {
  const open = useSetAtom(
    useMemo(() => {
      return atom(null, (_, set, update: { taskId: string }) => {
        set(dialogAtom, {
          isOpen: true,
          taskId: update.taskId,
        });
      });
    }, []),
  );

  return { open };
};

type Props = {};
export const TaskDeleteDialog: React.FC<Props> = () => {
  const [dialogState, setDialogAtom] = useAtom(dialogAtom);
  const { deleteTask, isDeleting } = useTaskDelete();

  const handleDeleteTask = async () => {
    const { isOpen, taskId } = dialogState;

    if (!isOpen) {
      return;
    }

    const result = await deleteTask(taskId);
    if (!result.error) {
      setDialogAtom({ isOpen: false, taskId: undefined });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // 開くときは削除対象となるtaskIdを必ず指定させる必要があるため、自動では開かれないようにする
      // radix-uiでは、Dialog.Triggerを使用しなければtrueで呼び出されることはない？
      return;
    }

    setDialogAtom({ isOpen: false, taskId: undefined });
  };

  const deleting = useMemo(() => {
    const { isOpen, taskId } = dialogState;

    if (!isOpen) {
      return false;
    }
    return isDeleting(taskId);
  }, [dialogState, isDeleting]);

  return (
    <Dialog.Root open={dialogState.isOpen} onOpenChange={handleOpenChange}>
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
              このタスクを本当に削除しますか？削除後は元に戻すことはできません。
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
