import { useToast } from "@/app/_components/toast";
import { graphql } from "@/gql";
import { useMutation } from "@apollo/client";
import { useCallback } from "react";
import { Task } from "@/gql/graphql";

const DeleteTaskMemoMutation = graphql(`
  mutation DeleteTaskMemoMutation($input: DeleteTaskMemoInput!) {
    deleteTaskMemo(input: $input) {
      taskMemo {
        id
        task {
          id
        }
      }
    }
  }
`);

type Args = {};
export const useDeleteTaskMemo = ({}: Args) => {
  const { toast } = useToast();
  const [deleteTaskMemoMutation, { loading }] = useMutation(
    DeleteTaskMemoMutation,
    {
      update: (cache, { data }) => {
        // TODO:
        // そもそもキャッシュの書き換えを行ってるのは、無限スクロールを実装してるTaskMemosQueryを
        // refetchした場合、これまでロードした全データではなく、最初のページしかfetchしないため。
        // パフォーマンスを考えるとその方が良いとは思うものの、キャッシュを手動で変更するのはバグの温床にしかならなそうなので避けたい・・・
        // たとえばtanstack-queryの場合、useInfiniteQueryは、これまでロードしたすべてのデータをfetchし直してくれる。
        // (https://tanstack.com/query/v4/docs/react/guides/infinite-queries#what-happens-when-an-infinite-query-needs-to-be-refetched)
        // tanstack-query + request-graphqlのほうが良いかもなぁ

        const taskCacheId = cache.identify({
          ...data?.deleteTaskMemo.taskMemo.task,
        });
        cache.modify({
          id: taskCacheId,
          fields: {
            ["memos" satisfies keyof Task]: (existingMemos, { readField }) => {
              const memos = existingMemos as Task["memos"];
              const result = {
                ...existingMemos,
                edges: memos.edges.filter((e) => {
                  return (
                    readField("id", e.node) !== data?.deleteTaskMemo.taskMemo.id
                  );
                }),
              } satisfies Task["memos"];
              return result;
            },
          },
        });
      },
      onQueryUpdated: (q) => {
        // refetchなしでキャッシュを更新する？
        // どこにもドキュメントないけど、これをつけるとTaskMemosQueryのキャッシュが更新される？
        // これがないとキャシュは変更されるものの、useQueryが反映されない。
        return q.reobserve();
      },
    },
  );

  const deleteTaskMemo = useCallback(
    async (memoId: string) => {
      await deleteTaskMemoMutation({
        variables: { input: { taskMemoId: memoId } },
        onError: (e) => {
          console.error(e);
          toast({
            type: "error",
            title: "メモの削除",
            description: "メモの削除に失敗しました。",
          });
        },
      });
    },
    [deleteTaskMemoMutation, toast],
  );

  return { deleteTaskMemo, loading };
};
