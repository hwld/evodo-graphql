"use client";

import { FragmentType, graphql, useFragment } from "@/gql";
import { TaskCheckbox } from "./task-checkbox";
import { TaskDeleteButton } from "./task-delete-button";
import { PencilIcon } from "lucide-react";
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

type Props = { task: FragmentType<typeof TaskItemFragment> };

export const TaskItem: React.FC<Props> = ({ task: _task }) => {
  const task = useFragment(TaskItemFragment, _task);

  return (
    <EditableTaskTitle.Root>
      <div className="flex justify-between rounded border-2 border-neutral-300 bg-neutral-100 p-2">
        <div className="flex items-center gap-2">
          <TaskCheckbox id={task.id} done={task.done} />
          <EditableTaskTitle.Field id={task.id} title={task.title} />
        </div>
        <div className="flex gap-1">
          <EditableTaskTitle.Trigger asChild>
            <TaskItemAction icon={PencilIcon} />
          </EditableTaskTitle.Trigger>
          <TaskDeleteButton id={task.id} />
        </div>
      </div>
    </EditableTaskTitle.Root>
  );
};
