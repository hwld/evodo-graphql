import { TaskItemFragmentFragment } from '@/gql/graphql';
import { graphql } from '@/gql';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { UpdateTaskDetailInputSchema } from '@/gql/validator';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMergeRefs } from '@floating-ui/react';
import { cx } from 'cva';
import { AlertCircleIcon, SaveIcon } from 'lucide-react';
import { Button } from '@/app/_components/button';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { stopPropagation } from '@/lib/utils';

const UpdateTaskDetailMutation = graphql(`
  mutation UpdateTaskDetailMutation($input: UpdateTaskDetailInput!) {
    updateTaskDetail(input: $input) {
      task {
        __typename
        id
        detail
      }
    }
  }
`);

const updateTaskDetailInputSchema = UpdateTaskDetailInputSchema().omit({
  id: true,
});
type UpdateTaskDetailInput = z.infer<typeof updateTaskDetailInputSchema>;

type Props = {
  task: TaskItemFragmentFragment;
};

export const EditableTaskDetail = forwardRef<HTMLTextAreaElement, Props>(
  function TaskDetailForm({ task }, ref) {
    const [editable, setEditable] = useState(false);
    const detailTextareaRef = useRef<HTMLTextAreaElement>(null);
    const detailTextRef = useRef<HTMLDivElement>(null);
    const textHeightRef = useRef(0);

    const [updateTaskDetail, { loading: updating }] = useMutation(
      UpdateTaskDetailMutation,
    );

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<UpdateTaskDetailInput>({
      defaultValues: { detail: task.detail },
      resolver: zodResolver(updateTaskDetailInputSchema),
    });

    const { ref: _ref, onChange, ...others } = register('detail');
    const textareaRef = useMergeRefs([ref, _ref, detailTextareaRef]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // min-heightに合わせる
      e.target.style.height = '100px';
      e.target.style.height = `${e.target.scrollHeight}px`;
      onChange(e);
    };

    const handleUpdateTaskDetail = handleSubmit(async ({ detail }) => {
      updateTaskDetail({
        variables: { input: { id: task.id, detail } },
        optimisticResponse: {
          updateTaskDetail: {
            task: { __typename: 'Task', detail, id: task.id },
          },
        },
        onError: () => {
          window.alert('タスクの説明を更新できませんでした。');
          setTimeout(() => detailTextareaRef.current?.focus(), 0);
        },
      });
      setEditable(false);
    });

    const handleCancel = () => {
      setEditable(false);
      reset({ detail: task.detail });
    };

    const handleClickDetail = () => {
      setEditable(true);
      setTimeout(() => {
        detailTextareaRef.current?.focus();
      }, 0);
    };

    // editableに変わったときにformに渡す高さをここでセットする
    useEffect(() => {
      if (!detailTextRef.current) {
        return;
      }
      const h = detailTextRef.current.clientHeight;
      if (h !== textHeightRef.current) {
        textHeightRef.current = h;
      }
    });

    useEffect(() => {
      if (!detailTextareaRef.current) {
        return;
      }
      // この時点でdetailTextのheightは0になっているので、事前にセットした高さを使用する
      detailTextareaRef.current.style.height = `${textHeightRef.current}px`;
    }, [editable]);

    return (
      <div>
        <div>
          {editable ? (
            <form className="flex w-full flex-col">
              <textarea
                className={cx(
                  'min-h-[100px] resize-none overflow-hidden rounded-lg border-neutral-300 bg-neutral-50 p-3 outline outline-2',
                  errors.detail ? 'outline-red-500' : 'outline-neutral-300',
                )}
                ref={textareaRef}
                onChange={handleChange}
                onKeyDown={stopPropagation}
                disabled={updating}
                placeholder="タスクの説明を入力してください..."
                {...others}
              ></textarea>
            </form>
          ) : (
            <div
              ref={detailTextRef}
              className={cx(
                'min-h-[100px] cursor-pointer rounded-lg p-3 outline outline-2 outline-neutral-300',
              )}
              onClick={handleClickDetail}
            >
              {task.detail ? (
                <p className="whitespace-pre-wrap">{task.detail}</p>
              ) : (
                <p className="text-neutral-500">
                  ここをクリックすると、タスクの説明を入力することができます...
                </p>
              )}
            </div>
          )}
        </div>
        {/* アニメーションのためにtextareaから分離させる */}
        <div className="mt-2 flex h-10 w-full items-center justify-between gap-1">
          <AnimatePresence>
            {editable && (
              <motion.div
                className="flex w-full justify-between"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
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
                  disabled={updating}
                >
                  <Button
                    color="white"
                    size="sm"
                    onClick={handleCancel}
                    type="button"
                  >
                    キャンセル
                  </Button>
                  <Button
                    size="sm"
                    type="submit"
                    debouncedIsLoading={updating}
                    leftIcon={SaveIcon}
                    onClick={handleUpdateTaskDetail}
                  >
                    保存する
                  </Button>
                </fieldset>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  },
);
