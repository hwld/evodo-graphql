"use client";

import { graphql } from "@/gql";
import { TaskItem } from "./task-item/task-item";
import { TaskDeleteDialog } from "./task-delete-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { EmptyTaskCard } from "./empty-task-card";
import { useSuspenseQuery } from "@apollo/client";

const TaskListQuery = graphql(`
  query TodoListQuery {
    myTasks {
      id
      ...TaskItemFragment
    }
  }
`);

export const TaskList: React.FC = () => {
  const { data, error } = useSuspenseQuery(TaskListQuery);

  if (error) {
    return <div>error</div>;
  }

  return (
    <>
      <div className="relative flex flex-col gap-2">
        <AnimatePresence initial={false} mode="popLayout">
          {data?.myTasks.length === 0 && (
            <motion.div
              layout
              className="w-full"
              initial={{ opacity: 0, y: -10, scale: 1.1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 1.1 }}
            >
              <EmptyTaskCard />
            </motion.div>
          )}
          {data?.myTasks.map((t) => {
            return (
              <motion.div
                layout
                key={t.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
