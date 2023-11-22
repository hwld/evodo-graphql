"use client";

import { FragmentType, graphql, useFragment } from "@/gql";
import { TaskCheckbox } from "./task-checkbox";
import { PencilIcon, TrashIcon } from "lucide-react";
import { EditableTaskTitle } from "../editable-task-title/index";
import { TaskItemAction } from "./task-item-action";

const TaskItemFragment = graphql(`
  fragment TaskItemFragment on Task {
    id
    title
    detail
    done
    createdAt
    updatedAt
  }
`);

type Props = {
  task: FragmentType<typeof TaskItemFragment>;
  onOpenTaskDeleteDialog: (taskId: string) => void;
  deletingTask: boolean;
};

export const TaskItem: React.FC<Props> = ({
  task: _task,
  onOpenTaskDeleteDialog,
  deletingTask,
}) => {
  const task = useFragment(TaskItemFragment, _task);

  const handleOpenTaskDeleteDialog = () => {
    onOpenTaskDeleteDialog(task.id);
  };

  return (
    <EditableTaskTitle.Root>
      <div className="flex justify-between gap-2 rounded border border-neutral-300 bg-neutral-100 p-2">
        <div className="flex grow items-center gap-2">
          <TaskCheckbox id={task.id} done={task.done} />
          <EditableTaskTitle.Field id={task.id} title={task.title} />
        </div>
        <div className="flex gap-1">
          <EditableTaskTitle.Trigger asChild>
            <TaskItemAction icon={PencilIcon} />
          </EditableTaskTitle.Trigger>
          <TaskItemAction
            icon={TrashIcon}
            disabled={deletingTask}
            onClick={handleOpenTaskDeleteDialog}
          />
        </div>
      </div>
    </EditableTaskTitle.Root>
  );
};
