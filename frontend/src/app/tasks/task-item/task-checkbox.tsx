"use client";

import { graphql } from "@/gql";
import { useMutation } from "urql";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { useRef } from "react";

type Animation = [Keyframe[], KeyframeAnimationOptions];
const doneAnimation: Animation = [
  [{ transform: "scale(1.5)" }, { transform: "scale(1)" }],
  { duration: 150 },
];
const undoneAnimation: Animation = [
  [{ transform: "scale(1)" }, { transform: "scale(1.1)" }],
  { duration: 150 },
];

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

type Props = { id: string; done: boolean };
export const TaskCheckbox: React.FC<Props> = ({ id, done }) => {
  const checkboxRef = useRef<HTMLButtonElement | null>(null);
  const [{ fetching: doing }, doneTask] = useMutation(DoneTask);
  const [{ fetching: undoing }, undoneTask] = useMutation(UndoneTask);

  const handleToggleTaskDone = async () => {
    const map = {
      done: {
        mutate: doneTask,
        animate: () => {
          checkboxRef.current?.animate(...doneAnimation);
        },
      },
      undone: {
        mutate: undoneTask,
        animate: () => {
          checkboxRef.current?.animate(...undoneAnimation);
        },
      },
    };

    const willDone = !done;
    const { animate, mutate } = map[willDone ? "done" : "undone"];

    animate();
    const result = await mutate({ id });

    if (result.error) {
      window.alert("タスクを更新できませんでした。");
      return;
    }
  };

  return (
    <>
      <Checkbox.Root
        ref={checkboxRef}
        id={id}
        checked={done}
        onCheckedChange={handleToggleTaskDone}
        disabled={doing || undoing}
        className="h-[25px] w-[25px] rounded border-2 text-neutral-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500
        focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 disabled:opacity-50 data-[state=checked]:bg-neutral-900"
      >
        <Checkbox.Indicator className="flex items-center justify-center">
          <CheckIcon size={20} />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </>
  );
};
