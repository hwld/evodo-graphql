import { graphql } from '@/gql';
import { atom, useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { noop } from '@/lib/utils';

const DoneTask = graphql(`
  mutation DoneTaskMutation($id: ID!) {
    doneTask(id: $id) {
      task {
        id
      }
    }
  }
`);
const UndoneTask = graphql(`
  mutation UndoneTaskMutation($id: ID!) {
    undoneTask(id: $id) {
      task {
        id
      }
    }
  }
`);

const togglingTaskIdsAtom = atom<string[]>([]);

type Args = { taskId: string; done: boolean };
export const useToggleTaskDone = ({ taskId, done }: Args) => {
  const [togglingIds, setTogglingIds] = useAtom(togglingTaskIdsAtom);
  const [doneTask] = useMutation(DoneTask);
  const [undoneTask] = useMutation(UndoneTask);

  const isToggling = useMemo(() => {
    return togglingIds.includes(taskId);
  }, [taskId, togglingIds]);

  const toggleTaskDone = useCallback(async () => {
    if (isToggling) {
      throw new Error(
        'すでに完了/未完了を切り替えています。操作を行う前に操作が実行中かチェックしてください。',
      );
    }

    setTogglingIds((ids) => [...ids, taskId]);

    let mutate;
    if (done) {
      mutate = undoneTask;
    } else {
      mutate = doneTask;
    }

    const result = await mutate({
      variables: { id: taskId },
      onError: noop,
    });
    setTogglingIds((ids) => ids.filter((i) => i !== taskId));

    return result;
  }, [done, doneTask, isToggling, setTogglingIds, taskId, undoneTask]);

  return { toggleTaskDone, isToggling };
};
