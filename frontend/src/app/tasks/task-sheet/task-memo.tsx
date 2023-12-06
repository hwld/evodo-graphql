import { Button } from "@/app/_components/button";
import { useToast } from "@/app/_components/toast";
import { FragmentType, graphql, useFragment } from "@/gql";
import { useMutation } from "@apollo/client";

const TaskMemoFragment = graphql(`
  fragment TaskMemoFragment on TaskMemo {
    id
    content
  }
`);

const DeleteTaskMemoMutation = graphql(`
  mutation DeleteTaskMemoMutation($input: DeleteTaskMemoInput!) {
    deleteTaskMemo(input: $input) {
      taskMemo {
        id
      }
    }
  }
`);

type Props = { memo: FragmentType<typeof TaskMemoFragment> };
export const TaskMemo: React.FC<Props> = ({ memo: _memo }) => {
  const memo = useFragment(TaskMemoFragment, _memo);
  const [deleteTaskMemo] = useMutation(DeleteTaskMemoMutation);
  const { toast } = useToast();

  const handleDeleteTaskMemo = async () => {
    await deleteTaskMemo({
      variables: { input: { taskMemoId: memo.id } },
      onError: () => {
        toast({
          type: "error",
          title: "メモの削除",
          description: "メモを削除しました",
        });
      },
    });
  };

  return (
    <div className="flex items-center justify-between p-1">
      <p>{memo.content}</p>
      <Button size="sm" onClick={handleDeleteTaskMemo}>
        削除
      </Button>
    </div>
  );
};
