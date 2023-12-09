import { graphql } from "@/gql";
import { useQuery } from "@apollo/client";
import { TaskMemo } from "./task-memo";
import { Button } from "@/app/_components/button";

export const TaskMemosQuery = graphql(`
  query TaskMemosQuery($taskId: ID!, $first: Int, $cursor: String) {
    myTask(taskId: $taskId) {
      id
      memos(first: $first, after: $cursor) {
        edges {
          node {
            id
            ...TaskMemoFragment
          }
          cursor
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`);

type Props = { taskId: string };
export const TaskMemoList: React.FC<Props> = ({ taskId }) => {
  const { data, fetchMore } = useQuery(TaskMemosQuery, {
    variables: { taskId },
  });
  const hasNextPage = data?.myTask.memos.pageInfo.hasNextPage;

  return (
    <div>
      {data?.myTask.memos.edges.map((edge) => {
        return (
          <div key={edge.node.id} className="">
            <TaskMemo memo={edge.node} />
          </div>
        );
      })}
      {hasNextPage && (
        <div className="mt-2 flex w-full">
          <Button
            size="sm"
            variant="outline"
            fullWidth
            disabled={!hasNextPage}
            onClick={async () => {
              if (hasNextPage) {
                await fetchMore({
                  variables: { cursor: data?.myTask.memos.pageInfo.endCursor },
                });
              }
            }}
          >
            もっと読み込む
          </Button>
        </div>
      )}
    </div>
  );
};
