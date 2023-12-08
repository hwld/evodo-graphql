import { TaskItemFragmentFragment } from "@/gql/graphql";
import { TaskCheckbox } from "../task-item/task-checkbox";
import { EditableTaskDescription } from "./editable-task-description";
import { Clock8Icon, FileIcon, RotateCcwIcon } from "lucide-react";
import { DateTime } from "@/app/_components/date-time";
import { TaskSheetRow } from "./task-sheet-row";
import { TaskMemoForm } from "./task-memo-form";
import { TaskMemoList } from "./task-memo-list";

type Props = {
  task: TaskItemFragmentFragment;
};

export const TaskSheetContent: React.FC<Props> = ({ task }) => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-neutral-500">task-title</p>
        <div className="mt-1 flex items-center gap-2">
          <TaskCheckbox
            id={task.id}
            checkboxId={`sheet-${task.id}`}
            done={task.done}
          />
          <label
            htmlFor={`sheet-${task.id}`}
            className="cursor-pointer break-all text-2xl font-bold"
          >
            {task.title}
          </label>
        </div>
        <div className="mt-1 h-[1px] bg-neutral-200" />
      </div>

      <div className="flex flex-col gap-2">
        <TaskSheetRow
          icon={Clock8Icon}
          label="作成した日時"
          content={<DateTime dateTime={new Date(task.createdAt)} />}
        />
        <TaskSheetRow
          icon={RotateCcwIcon}
          label="更新した日時"
          content={<DateTime dateTime={new Date(task.updatedAt)} />}
        />
        <div className="h-[1px] bg-neutral-200" />
      </div>

      <EditableTaskDescription task={task} />

      <div className="flex flex-col">
        <div className="flex items-center gap-1 text-neutral-500">
          <FileIcon size={20} />
          <p className="text-sm">メモ</p>
        </div>
        <div className="my-2 h-[1px] w-full bg-neutral-200" />
        <TaskMemoList taskId={task.id} />
        <div className="mt-2">
          <TaskMemoForm taskId={task.id} />
        </div>
      </div>
    </div>
  );
};
