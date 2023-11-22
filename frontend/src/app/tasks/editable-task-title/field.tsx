import { graphql } from "@/gql";
import { useEditableTaskTitleContext } from "./root";
import { SyntheticEvent, useState } from "react";
import { useMutation } from "urql";
import clsx from "clsx";

const UpdateTaskTitle = graphql(`
  mutation UpdateTaskTitleMutation($id: ID!, $title: String!) {
    updateTaskTitle(id: $id, title: $title) {
      task {
        id
      }
    }
  }
`);

export const _Field: React.FC<{ title: string; id: string }> = ({
  title,
  id,
}) => {
  const { editable, setEditable, inputRef } = useEditableTaskTitleContext();
  const [editableTitle, setEditableTitle] = useState(title);
  const [{ fetching: updating }, updateTaskTitleMutation] =
    useMutation(UpdateTaskTitle);

  const handleChangeEditableTitle: React.ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    setEditableTitle(e.target.value);
  };

  const handleCancelEditable = () => {
    setEditable(false);
  };

  const handleUpdateTaskTitle = async (e: SyntheticEvent) => {
    e.preventDefault();

    const result = await updateTaskTitleMutation({
      id,
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
    <div className="w-full">
      <form
        className={clsx({ hidden: !editable })}
        onSubmit={handleUpdateTaskTitle}
      >
        <input
          ref={inputRef}
          value={editableTitle}
          onChange={handleChangeEditableTitle}
          onBlur={handleCancelEditable}
          className="w-full rounded bg-neutral-100 pl-1 focus-visible:outline-neutral-900"
          disabled={updating}
        />
      </form>
      <label
        htmlFor={id}
        className={clsx("cursor-pointer select-none pl-1", {
          hidden: editable,
        })}
      >
        {title}
      </label>
    </div>
  );
};
