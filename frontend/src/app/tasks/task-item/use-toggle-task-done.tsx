import { graphql } from "@/gql";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { useMutation } from "@apollo/client";

const UpdateTaskDoneMutation = graphql(`
  mutation UpdateTaskDoneMutation($input: UpdateTaskDoneInput!) {
    updateTaskDone(input: $input) {
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
  const [toggleTaskDoneMutate] = useMutation(UpdateTaskDoneMutation);

  const isToggling = useMemo(() => {
    return togglingIds.includes(taskId);
  }, [taskId, togglingIds]);

  const toggleTaskDone = useCallback(
    async ({ onError }: { onError?: () => void }) => {
      if (isToggling) {
        throw new Error(
          "すでに完了/未完了を切り替えています。操作を行う前に操作が実行中かチェックしてください。",
        );
      }

      toggleStart(taskId);

      toggleTaskDoneMutate({
        variables: { input: { id: taskId, done: !done } },
        optimisticResponse: {
          updateTaskDone: {
            task: { __typename: "Task", done: !done, id: taskId },
          },
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
    [done, isToggling, taskId, toggleEnd, toggleStart, toggleTaskDoneMutate],
  );

  return { toggleTaskDone, isToggling };
};
