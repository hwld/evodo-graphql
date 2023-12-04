import { graphql } from "@/gql";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import { noop } from "@/lib/utils";
import { useToast } from "../_components/toast";

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
  const { toast } = useToast();
  const [deletingTaskIds, setDeletingTaskIds] = useAtom(deletingTasIdsAtom);
  const [deleteTaskMutation] = useMutation(DeleteTaskMutation);

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
          "すでに削除を実行中です。操作を行う前に実行中かチェックしてください。",
        );
      }

      setDeletingTaskIds((ids) => [...ids, id]);

      const result = await deleteTaskMutation({
        variables: { id },
        // 例外を出さずにresult.errorsにエラーをセットするために何もしない関数を渡す
        // TODO: useMutationのグローバル設定で設定したいけど、無理そう？
        onError: noop,
      });

      if (result.errors) {
        toast({
          type: "error",
          title: "タスクの削除",
          description: "タスクが削除できませんでした。",
        });
      }

      setDeletingTaskIds((ids) => ids.filter((i) => i !== id));

      return result;
    },
    [deleteTaskMutation, isDeleting, setDeletingTaskIds, toast],
  );

  return { deleteTask, isDeleting };
};
