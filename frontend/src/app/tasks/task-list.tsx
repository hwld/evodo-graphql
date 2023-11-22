"use client";

import { graphql } from "@/gql";
import { OperationContext, useQuery } from "urql";
import { TaskItem } from "./task-item/task-item";
import { useMemo } from "react";
import { Task } from "@/gql/graphql";

const TaskListQuery = graphql(`
  query TodoListQuery {
    myTasks {
      id
      ...TaskItemFragment
    }
  }
`);

export const TaskList: React.FC = () => {
  const context: Partial<OperationContext> = useMemo(() => {
    return { additionalTypenames: ["Task" satisfies Task["__typename"]] };
  }, []);
  const [{ data, fetching, error }] = useQuery({
    query: TaskListQuery,
    context,
  });

  if (fetching) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>error</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {data?.myTasks.map((t) => {
        return (
          <div key={t.id}>
            <TaskItem task={t} />
          </div>
        );
      })}
    </div>
  );
};
