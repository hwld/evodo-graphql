import { Sheet } from '@/app/_components/sheet';
import { TaskItemFragmentFragment } from '@/gql/graphql';
import { TaskCheckbox } from './task-checkbox';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/app/_components/button';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { useForm } from 'react-hook-form';
import { UpdateTaskDetailInputSchema } from '@/gql/validator';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMergeRefs } from '@floating-ui/react';
import { AlertCircleIcon } from 'lucide-react';
import { cx } from 'cva';

const UpdateTaskDetailMutation = graphql(`
  mutation UpdateTaskDetailMutation($input: UpdateTaskDetailInput!) {
    updateTaskDetail(input: $input) {
      task {
        id
      }
    }
  }
`);

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task: TaskItemFragmentFragment;
};

const updateTaskDetailInputSchema = UpdateTaskDetailInputSchema().omit({
  id: true,
});
type UpdateTaskDetailInput = z.infer<typeof updateTaskDetailInputSchema>;

export const TaskSheet: React.FC<Props> = ({ open, onOpenChange, task }) => {
  const detailTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [editable, setEditable] = useState(false);
  const [{ fetching: updateting }, updateTaskDetail] = useMutation(
    UpdateTaskDetailMutation,
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTaskDetailInput>({
    defaultValues: { detail: '' },
    resolver: zodResolver(updateTaskDetailInputSchema),
  });

  const { ref, onChange, ...others } = register('detail');
  const textareaRef = useMergeRefs([detailTextareaRef, ref]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = '100px';
    e.target.style.height = `${e.target.scrollHeight}px`;
    onChange(e);
  };

  const handleUpdateTaskDetail = handleSubmit(async ({ detail }) => {
    const result = await updateTaskDetail({ input: { id: task.id, detail } });
    if (result.error) {
      window.alert('タスクを更新できませんでした。');
      return;
    }

    setEditable(false);
  });

  const handleClickDetail = () => {
    setEditable(true);
    setTimeout(() => {
      detailTextareaRef.current?.focus();
    }, 0);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <div className="flex h-full flex-col">
        <p className="text-neutral-500">task-title</p>
        <div className="mt-1 flex items-center gap-2">
          <TaskCheckbox
            id={task.id}
            checkboxId={`sheet-${task.id}`}
            done={task.done}
          />
          <label
            htmlFor={`sheet-${task.id}`}
            className="cursor-pointer text-2xl font-bold"
          >
            {task.title}
          </label>
        </div>
        {editable ? (
          <textarea
            className={cx(
              'relative mt-5 min-h-[100px] resize-none rounded-lg border-neutral-300 bg-neutral-50 p-3 outline outline-2 disabled:cursor-not-allowed disabled:opacity-50',
              errors.detail ? 'outline-red-500' : 'outline-neutral-300',
            )}
            ref={textareaRef}
            onChange={handleChange}
            {...others}
            disabled={updateting}
          ></textarea>
        ) : (
          <ScrollArea.Root
            className="relative mt-5 min-h-[100px] overflow-hidden rounded-lg p-3 outline outline-2 outline-neutral-300"
            onClick={handleClickDetail}
          >
            <ScrollArea.Viewport className="h-full w-full" asChild>
              <p className="whitespace-pre">{task.detail}</p>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              className="data-[state=visible]:animate-showScrollbar data-[state=hidden]:animate-hideScrollbar flex h-full w-[13px] touch-none select-none bg-transparent p-[3px] hover:bg-neutral-200"
              orientation="vertical"
            >
              <ScrollArea.Thumb className="relative grow rounded-full bg-neutral-400 transition-colors hover:bg-neutral-500" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
          </ScrollArea.Root>
        )}
        <AnimatePresence>
          {editable && (
            <motion.div
              className="mt-2 flex w-full items-start justify-between gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-1 text-red-500">
                {errors.detail && (
                  <>
                    <AlertCircleIcon size={20} className="flex-shrink-0" />
                    <p className="text-sm">{errors.detail?.message}</p>
                  </>
                )}
              </div>

              <fieldset
                className="flex flex-shrink-0 items-center gap-1"
                disabled={updateting}
              >
                <Button
                  color="white"
                  size="sm"
                  onClick={() => setEditable(false)}
                >
                  キャンセル
                </Button>
                <Button size="sm" onClick={handleUpdateTaskDetail}>
                  保存する
                </Button>
              </fieldset>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Sheet>
  );
};
