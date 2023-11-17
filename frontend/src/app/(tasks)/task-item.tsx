import { FragmentType, graphql, useFragment } from "@/gql";
import { TaskCheckbox } from "./task-checkbox";
import { TaskDeleteButton } from "./task-delete-button";
import { PencilIcon } from "lucide-react";
import { EditableTaskTitle } from "./editable-task-title/index";

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
      <div className="flex justify-between p-2 border border-neutral-700 rounded">
        <div className="flex items-center gap-2">
          <TaskCheckbox id={task.id} done={task.done} />
          <EditableTaskTitle.Field id={task.id} title={task.title} />
        </div>
        <div className="flex gap-2">
          <EditableTaskTitle.Trigger>
            <PencilIcon />
          </EditableTaskTitle.Trigger>
          <TaskDeleteButton id={task.id} />
        </div>
      </div>
    </EditableTaskTitle.Root>
  );
};
