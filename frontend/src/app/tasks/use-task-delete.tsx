import { graphql } from "@/gql/gql";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { useMutation } from "urql";

const deletingTasIdsAtom = atom<string[]>([]);

const DeleteTaskMutation = graphql(`
  mutation DeleteTaskMutation($id: ID!) {
    deleteTask(id: $id) {
      task {
        id
      }
    }
  }
`);

export const useTaskDelete = () => {
  const [deletingTaskIds, setDeletingTaskIds] = useAtom(deletingTasIdsAtom);
  const [, deleteTaskMutation] = useMutation(DeleteTaskMutation);

  const deleteTask = useCallback(
    async (id: string) => {
      setDeletingTaskIds((ids) => [...ids, id]);

      const result = await deleteTaskMutation({ id });
      setDeletingTaskIds((ids) => ids.filter((i) => i !== id));

      if (result.error) {
        window.alert("タスクが削除できませんでした。");
      }

      return result;
    },
    [deleteTaskMutation, setDeletingTaskIds],
  );

  const isDeleting = useCallback(
    (id: string) => {
      return deletingTaskIds.includes(id);
    },
    [deletingTaskIds],
  );

  return { deleteTask, isDeleting };
};
