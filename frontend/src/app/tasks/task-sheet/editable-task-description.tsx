import { useEffect as useLayoutEffect, useRef, useState } from "react";
import { TaskDescriptionForm } from "./task-description-form";
import { TaskItemFragmentFragment } from "@/gql/graphql";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  task: TaskItemFragmentFragment;
};

export const EditableTaskDescription: React.FC<Props> = ({ task }) => {
  const [editable, setEditable] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const handleClickDescription = () => {
    setEditable(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  // textRefを持つコンポーネントのマウント・アンマウントのタイミングによって、clientHeightがundefined
  // になり、高さが適切に設定されない可能性がある。
  // 今はAnimatePresenceでラップしているため高さが取得できているが、できなくなるかも
  useLayoutEffect(() => {
    if (!textareaRef.current || !textRef.current) {
      return;
    }

    textareaRef.current.style.height = `${textRef.current.clientHeight}px`;
  }, [editable]);

  return (
    <div className="relative w-full">
      <AnimatePresence mode="popLayout">
        {editable ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TaskDescriptionForm
              ref={textareaRef}
              taskId={task.id}
              defaultValues={{ description: task.description }}
              disableEditing={() => setEditable(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="view"
            onClick={handleClickDescription}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              ref={textRef}
              className="min-h-[100px] cursor-pointer rounded-lg p-3 outline outline-2 outline-neutral-200"
            >
              {task.description ? (
                <p className="whitespace-pre-wrap">{task.description}</p>
              ) : (
                <p className="text-neutral-500">
                  ここをクリックすると、タスクの説明を入力することができます...
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
