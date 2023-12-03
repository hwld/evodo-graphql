import { TaskItemFragmentFragment } from '@/gql/graphql';
import { graphql } from '@/gql';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { UpdateTaskDescriptionInputSchema } from '@/gql/validator';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMergeRefs } from '@floating-ui/react';
import { cx } from 'cva';
import { AlertCircleIcon, SaveIcon } from 'lucide-react';
import { Button } from '@/app/_components/button';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { stopPropagation } from '@/lib/utils';

const UpdateTaskDescriptionMutation = graphql(`
  mutation UpdateTaskDescriptionMutation($input: UpdateTaskDescriptionInput!) {
    updateTaskDescription(input: $input) {
      task {
        __typename
        id
        description
      }
    }
  }
`);

const updateTaskDescriptionInputSchema =
  UpdateTaskDescriptionInputSchema().omit({
    id: true,
  });
type UpdateTaskDescriptionInput = z.infer<
  typeof updateTaskDescriptionInputSchema
>;

type Props = {
  task: TaskItemFragmentFragment;
};

export const EditableTaskDescription = forwardRef<HTMLTextAreaElement, Props>(
  function TaskDescriptionForm({ task }, ref) {
    const [editable, setEditable] = useState(false);
    const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
    const descriptionTextRef = useRef<HTMLDivElement>(null);
    const textHeightRef = useRef(0);

    const [updateTaskDescription, { loading: updating }] = useMutation(
      UpdateTaskDescriptionMutation,
    );

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<UpdateTaskDescriptionInput>({
      defaultValues: { description: task.description },
      resolver: zodResolver(updateTaskDescriptionInputSchema),
    });

    const { ref: _ref, onChange, ...others } = register('description');
    const textareaRef = useMergeRefs([ref, _ref, descriptionTextareaRef]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // min-heightに合わせる
      e.target.style.height = '100px';
      e.target.style.height = `${e.target.scrollHeight}px`;
      onChange(e);
    };

    const handleUpdateTaskDescription = handleSubmit(
      async ({ description }) => {
        updateTaskDescription({
          variables: { input: { id: task.id, description } },
          optimisticResponse: {
            updateTaskDescription: {
              task: {
                __typename: 'Task',
                description: description,
                id: task.id,
              },
            },
          },
          onError: () => {
            window.alert('タスクの説明を更新できませんでした。');
            setTimeout(() => descriptionTextareaRef.current?.focus(), 0);
          },
        });

        setEditable(false);
      },
    );

    const handleCancel = () => {
      setEditable(false);
      reset({ description: task.description });
    };

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
      <div>
        <div>
          {editable ? (
            <form className="flex w-full flex-col">
              <textarea
                className={cx(
                  'min-h-[100px] resize-none overflow-hidden rounded-lg border-neutral-300 bg-neutral-50 p-3 outline outline-2',
                  errors.description
                    ? 'outline-red-500'
                    : 'outline-neutral-300',
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
              ref={descriptionTextRef}
              className={cx(
                'min-h-[100px] cursor-pointer rounded-lg p-3 outline outline-2 outline-neutral-300',
              )}
              onClick={handleClickDescription}
            >
              {task.description ? (
                <p className="whitespace-pre-wrap">{task.description}</p>
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
                  {errors.description && (
                    <>
                      <AlertCircleIcon size={20} className="flex-shrink-0" />
                      <p className="text-sm">{errors.description?.message}</p>
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
                    onClick={handleUpdateTaskDescription}
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
