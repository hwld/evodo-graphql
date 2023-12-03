import { TrashIcon } from "lucide-react";
import { atom, useAtom, useSetAtom } from "jotai";
import { useTaskDelete } from "./use-task-delete";
import { useMemo } from "react";
import { Button } from "../_components/button";
import { Dialog } from "../_components/dialog";

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
    if (!result.errors) {
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
    <Dialog
      height={230}
      isOpen={dialogState.isOpen}
      onOpenChange={handleOpenChange}
      title="タスクの削除"
      content={
        <p>
          このタスクを本当に削除しますか？削除後は元に戻すことはできません。
        </p>
      }
      cancelButton={<Button color="white">キャンセル</Button>}
      actionButton={
        <Button
          onClick={handleDeleteTask}
          leftIcon={TrashIcon}
          disabled={deleting}
          debouncedIsLoading={deleting}
        >
          削除する
        </Button>
      }
    />
  );
};
