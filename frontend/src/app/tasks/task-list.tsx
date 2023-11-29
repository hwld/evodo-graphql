'use client';

import { graphql } from '@/gql';
import { OperationContext, useQuery } from 'urql';
import { TaskItem } from './task-item/task-item';
import { useMemo } from 'react';
import { Task } from '@/gql/graphql';
import { TaskDeleteDialog } from './task-delete-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { EmptyTaskCard } from './empty-task-card';

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
    return { additionalTypenames: ['Task' satisfies Task['__typename']] };
  }, []);
  const [{ data, error }] = useQuery({
    query: TaskListQuery,
    context,
    requestPolicy: 'network-only',
  });

  if (error) {
    return <div>error</div>;
  }

  return (
    <>
      <div className="relative flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {data?.myTasks.length === 0 && (
            // myTasksが1->0になったときにこのコンポーネントがレイアウトアニメーションに影響を与えないように
            // absoluteにする
            <motion.div
              className="absolute mt-5 w-full"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <EmptyTaskCard />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="popLayout" initial={false}>
          {data?.myTasks.map((t) => {
            return (
              <motion.div
                layout
                key={t.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
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
