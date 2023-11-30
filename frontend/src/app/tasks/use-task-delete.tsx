import { graphql } from '@/gql';
import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';
import { useMutation } from 'urql';

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

  const isDeleting = useCallback(
    (id: string) => {
      return deletingTaskIds.includes(id);
    },
    [deletingTaskIds],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (isDeleting(id)) {
        throw new Error(
          'すでに削除を実行中です。操作を行う前に実行中かチェックしてください。',
        );
      }

      setDeletingTaskIds((ids) => [...ids, id]);

      const result = await deleteTaskMutation({ id });
      setDeletingTaskIds((ids) => ids.filter((i) => i !== id));

      if (result.error) {
        window.alert('タスクが削除できませんでした。');
      }

      return result;
    },
    [deleteTaskMutation, isDeleting, setDeletingTaskIds],
  );

  return { deleteTask, isDeleting };
};
