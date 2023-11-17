"use client";

import { graphql } from "@/gql";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useMutation } from "urql";

type Props = {};

const CreateTask = graphql(`
  mutation CreateTaskMutation($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
    }
  }
`);

export const TaskInput: React.FC<Props> = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [{ fetching }, createTaskMutation] = useMutation(CreateTask);

  const handleChangeTaskTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
  };

  const handleCreateTask = async (e: SyntheticEvent) => {
    if (fetching) {
      return;
    }

    e.preventDefault();
    const result = await createTaskMutation({ input: { title: taskTitle } });
    if (result.error) {
      window.alert("タスクが入力できませんでした");
      return;
    }
    setTaskTitle("");
  };

  return (
    <form className="w-full" onSubmit={handleCreateTask}>
      <input
        className="p-3 rounded w-full"
        placeholder="タスクを入力してください..."
        onChange={handleChangeTaskTitle}
        value={taskTitle}
      />
    </form>
  );
};
