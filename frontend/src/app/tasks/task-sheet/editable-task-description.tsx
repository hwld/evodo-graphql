import { cx } from "cva";
import { useEffect, useRef, useState } from "react";
import { TaskDescriptionForm } from "./task-description-form";
import { TaskItemFragmentFragment } from "@/gql/graphql";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  task: TaskItemFragmentFragment;
};

export const EditableTaskDescription: React.FC<Props> = ({ task }) => {
  const [editable, setEditable] = useState(false);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const descriptionTextRef = useRef<HTMLDivElement>(null);
  const textHeightRef = useRef(0);

  const handleClickDescription = () => {
    setEditable(true);
    setTimeout(() => {
      descriptionTextareaRef.current?.focus();
    }, 0);
  };

  // editableに変わったときにformに渡す高さをここでセットする
  useEffect(() => {
    if (!descriptionTextRef.current) {
      return;
    }
    const h = descriptionTextRef.current.clientHeight;
    if (h !== textHeightRef.current) {
      textHeightRef.current = h;
    }
  });

  useEffect(() => {
    if (!descriptionTextareaRef.current) {
      return;
    }
    // この時点でdescriptionTextのheightは0になっているので、事前にセットした高さを使用する
    descriptionTextareaRef.current.style.height = `${textHeightRef.current}px`;
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
              ref={descriptionTextareaRef}
              taskId={task.id}
              defaultValues={{ description: task.description }}
              disableEditing={() => setEditable(false)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="view"
            ref={descriptionTextRef}
            className={cx(
              "min-h-[100px] cursor-pointer rounded-lg p-3 outline outline-2 outline-neutral-300",
            )}
            onClick={handleClickDescription}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {task.description ? (
              <p className="whitespace-pre-wrap">{task.description}</p>
            ) : (
              <p className="text-neutral-500">
                ここをクリックすると、タスクの説明を入力することができます...
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
