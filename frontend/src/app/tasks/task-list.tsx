"use client";

import { graphql } from "@/gql";
import { OperationContext, useQuery } from "urql";
import { TaskItem } from "./task-item/task-item";
import { useMemo } from "react";
import { Task } from "@/gql/graphql";
import { TaskDeleteDialog } from "./task-delete-dialog";
import { AnimatePresence, motion } from "framer-motion";

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
    <>
      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {data?.myTasks.map((t) => {
            return (
              <motion.div
                layout
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <TaskItem task={t} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <TaskDeleteDialog />
    </>
  );
};
