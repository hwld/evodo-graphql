"use client";

import { graphql } from "@/gql";
import { useMutation } from "urql";

const DoneTask = graphql(`
  mutation DoneTaskMutation($id: ID!) {
    doneTask(id: $id) {
      id
    }
  }
`);
const UndoneTask = graphql(`
  mutation UndoneTaskMutation($id: ID!) {
    undoneTask(id: $id) {
      id
    }
  }
`);

type Props = { id: string; done: boolean };
export const TaskCheckbox: React.FC<Props> = ({ id, done }) => {
  const [{ fetching: doing }, doneTask] = useMutation(DoneTask);
  const [{ fetching: undoing }, undoneTask] = useMutation(UndoneTask);

  const handleToggleTaskDone = async () => {
    let result;
    if (done) {
      result = await undoneTask({ id });
    } else {
      result = await doneTask({ id });
    }

    if (result.error) {
      window.alert("タスクを更新できませんでした。");
      return;
    }
  };

  return (
    <input
      type="checkbox"
      className="w-[20px] h-[20px]"
      checked={done}
      disabled={doing || undoing}
      onChange={handleToggleTaskDone}
    />
  );
};
