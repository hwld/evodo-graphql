import { graphql } from '@/gql';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/client';

const DoneTask = graphql(`
  mutation DoneTaskMutation($id: ID!) {
    doneTask(id: $id) {
      task {
        id
        done
      }
    }
  }
`);
const UndoneTask = graphql(`
  mutation UndoneTaskMutation($id: ID!) {
    undoneTask(id: $id) {
      task {
        id
        done
      }
    }
  }
`);

const togglingTaskIdsAtom = atom<string[]>([]);
const toggleStartAtom = atom(null, (_, set, taskId: string) => {
  set(togglingTaskIdsAtom, (ids) => [...ids, taskId]);
});
const toggleEndAtom = atom(null, (_, set, taskId: string) => {
  set(togglingTaskIdsAtom, (ids) => ids.filter((i) => i !== taskId));
});

type Args = { taskId: string; done: boolean };
export const useToggleTaskDone = ({ taskId, done }: Args) => {
  const togglingIds = useAtomValue(togglingTaskIdsAtom);
  const toggleStart = useSetAtom(toggleStartAtom);
  const toggleEnd = useSetAtom(toggleEndAtom);
  const [doneTask] = useMutation(DoneTask);
  const [undoneTask] = useMutation(UndoneTask);

  const isToggling = useMemo(() => {
    return togglingIds.includes(taskId);
  }, [taskId, togglingIds]);

  const toggleTaskDone = useCallback(
    async ({ onError }: { onError?: () => void }) => {
      if (isToggling) {
        throw new Error(
          'すでに完了/未完了を切り替えています。操作を行う前に操作が実行中かチェックしてください。',
        );
      }

      toggleStart(taskId);

      let mutate;
      if (done) {
        mutate = undoneTask;
      } else {
        mutate = doneTask;
      }

      mutate({
        variables: { id: taskId },
        optimisticResponse: {
          doneTask: { task: { __typename: 'Task', id: taskId, done: true } },
          undoneTask: { task: { __typename: 'Task', id: taskId, done: false } },
        },
        onError: () => {
          onError?.();
          toggleEnd(taskId);
        },
        onCompleted: () => {
          toggleEnd(taskId);
        },
      });
    },
    [done, doneTask, isToggling, taskId, toggleEnd, toggleStart, undoneTask],
  );

  return { toggleTaskDone, isToggling };
};
