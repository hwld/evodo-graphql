import { FragmentType, graphql, useFragment } from "@/gql";
import { TaskCheckbox } from "./task-checkbox";
import { TaskDeleteButton } from "./task-delete-button";
import { PencilIcon } from "lucide-react";
import { SyntheticEvent, useRef, useState } from "react";
import clsx from "clsx";
import { useMutation } from "urql";

const UpdateTaskTitle = graphql(`
  mutation UpdateTaskTitleMutation($id: ID!, $title: String!) {
    updateTaskTitle(id: $id, title: $title) {
      id
    }
  }
`);

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

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [editable, setEditable] = useState(false);
  const [editableTitle, setEditableTitle] = useState(task.title);
  const [{ fetching: updating }, updateTaskTitleMutation] =
    useMutation(UpdateTaskTitle);

  const handleCancelEditable = () => {
    setEditable(false);
  };

  const handleSetEditable = () => {
    if (!inputRef.current) {
      return;
    }
    setEditable(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleUpdateTaskTitle = async (e: SyntheticEvent) => {
    e.preventDefault();

    const result = await updateTaskTitleMutation({
      id: task.id,
      title: editableTitle,
    });
    if (result.error) {
      window.alert("タスク名を変えられませんでした");
      inputRef.current?.focus();
      return;
    }
    setEditable(false);
  };

  return (
    <div className="flex justify-between p-2 border border-neutral-700 m-2 rounded">
      <div className="flex items-center gap-2">
        <TaskCheckbox id={task.id} done={task.done} />
        <form
          className={clsx({ hidden: !editable })}
          onSubmit={handleUpdateTaskTitle}
        >
          <input
            ref={inputRef}
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
            onBlur={handleCancelEditable}
            className="pl-1"
            disabled={updating}
          />
        </form>
        <div className={clsx("pl-1", { hidden: editable })}>{task.title}</div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSetEditable}>
          <PencilIcon />
        </button>
        <TaskDeleteButton id={task.id} />
      </div>
    </div>
  );
};
