"use client";

import { graphql } from "@/gql";
import { OperationContext, useQuery } from "urql";
import { TaskItem } from "./task-item";
import { useMemo } from "react";
import { Task } from "@/gql/graphql";

const TaskListQuery = graphql(`
  query TodoListQuery {
    tasks {
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
    <div>
      {data?.tasks.map((t) => {
        return <TaskItem task={t} key={t.id} />;
      })}
    </div>
  );
};
