import { graphql } from "@/gql";
import { TrashIcon } from "lucide-react";
import { useMutation } from "urql";

const DeleteTask = graphql(`
  mutation DeleteTaskMutation($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`);

type Props = { id: string };
export const TaskDeleteButton: React.FC<Props> = ({ id }) => {
  const [{ fetching: deleting }, deleteTaskMutation] = useMutation(DeleteTask);

  const handleDeleteTask = async () => {
    const result = await deleteTaskMutation({ id });
    if (result.error) {
      window.alert("タスクが削除できませんでした");
      return;
    }
  };

  return (
    <button onClick={handleDeleteTask} disabled={deleting}>
      <TrashIcon />
    </button>
  );
};
