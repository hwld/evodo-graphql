import { graphql } from "@/gql";
import { SyntheticEvent, useState } from "react";
import { useMutation } from "urql";
import clsx from "clsx";
import { useEditableTaskTitle } from "./state";

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
  const { inputEl, editable, setInputEl, disableEditing } =
    useEditableTaskTitle();
  const [editableTitle, setEditableTitle] = useState(title);
  const [{ fetching: updating }, updateTaskTitleMutation] =
    useMutation(UpdateTaskTitle);

  const handleChangeEditableTitle: React.ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    setEditableTitle(e.target.value);
  };

  const handleUpdateTaskTitle = async (e: SyntheticEvent) => {
    e.preventDefault();

    const result = await updateTaskTitleMutation({
      id,
      title: editableTitle,
    });
    if (result.error) {
      window.alert("タスク名を変えられませんでした");
      inputEl?.focus();
      return;
    }

    disableEditing();
  };

  return (
    <div className="w-full">
      <form
        className={clsx({ hidden: !editable })}
        onSubmit={handleUpdateTaskTitle}
      >
        <input
          ref={setInputEl}
          value={editableTitle}
          onChange={handleChangeEditableTitle}
          onBlur={disableEditing}
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
