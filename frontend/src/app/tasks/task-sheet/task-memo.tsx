import { DateTime } from "@/app/_components/date-time";
import { IconButton } from "@/app/_components/icon-button";
import { useToast } from "@/app/_components/toast";
import { Tooltip } from "@/app/_components/tooltip";
import { FragmentType, graphql, useFragment } from "@/gql";
import { useMutation } from "@apollo/client";
import { TrashIcon } from "lucide-react";

const TaskMemoFragment = graphql(`
  fragment TaskMemoFragment on TaskMemo {
    id
    content
    createdAt
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
  const [deleteTaskMemo, { loading }] = useMutation(DeleteTaskMemoMutation);
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
    <div className="group relative flex flex-col gap-1 rounded p-2 transition-all hover:bg-black/5">
      <div className="flex flex-col gap-1">
        <p className="break-all text-sm">{memo.content}</p>{" "}
        <DateTime size="xs" muted dateTime={new Date(memo.createdAt)} />
      </div>
      <div className="absolute right-1 top-1 flex justify-end rounded bg-neutral-700 opacity-0 transition-opacity group-hover:opacity-100">
        <Tooltip label="メモを削除する">
          <IconButton
            color="white"
            size="sm"
            onClick={handleDeleteTaskMemo}
            disabled={loading}
            icon={TrashIcon}
          />
        </Tooltip>
      </div>
    </div>
  );
};
