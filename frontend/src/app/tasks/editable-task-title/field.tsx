import { graphql } from '@/gql';
import { cx } from 'cva';
import { useForm } from 'react-hook-form';
import { UpdateTaskTitleInputSchema } from '@/gql/validator';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMergeRefs } from '@floating-ui/react';
import { motion } from 'framer-motion';
import { AlertCircleIcon } from 'lucide-react';
import { Popover } from '@/app/_components/popover';
import { useEditableTaskTitle } from './root';
import { stopPropagation } from '@/lib/utils';
import { useMutation } from '@apollo/client';

const UpdateTaskTitle = graphql(`
  mutation UpdateTaskTitleMutation($input: UpdateTaskTitleInput!) {
    updateTaskTitle(input: $input) {
      task {
        __typename
        id
        title
      }
    }
  }
`);

const updateTaskTitleInputSchema = UpdateTaskTitleInputSchema().omit({
  id: true,
});
type UpdateTaskTitleInput = z.infer<typeof updateTaskTitleInputSchema>;

type Props = { title: string; id: string };

export const _Field: React.FC<Props> = ({ title, id }) => {
  const {
    inputRef: _inputRef,
    editable,
    disableEditing,
  } = useEditableTaskTitle();
  const [updateTaskTitle] = useMutation(UpdateTaskTitle);

  const {
    register: _register,
    handleSubmit: _handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    watch,
  } = useForm<UpdateTaskTitleInput>({
    defaultValues: { title },
    resolver: zodResolver(updateTaskTitleInputSchema),
  });

  const { ref: _ref, onBlur, ...register } = _register('title');
  const inputRef = useMergeRefs([_inputRef, _ref]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(e);
    disableEditing();
    setValue('title', title);
    clearErrors();
  };

  const handleUpdateTaskTitle = _handleSubmit(async (data) => {
    updateTaskTitle({
      variables: {
        input: {
          id,
          title: data.title,
        },
      },
      optimisticResponse: {
        updateTaskTitle: {
          task: { __typename: 'Task', id, title: data.title },
        },
      },
      onError: () => {
        window.alert('タスク名を変更できませんでした。');
        setTimeout(() => _inputRef?.current?.focus(), 0);
      },
    });

    disableEditing();
  });

  return (
    <Popover.Root
      isOpen={!!errors.title}
      placement="bottom-start"
      offsetOptions={{ mainAxis: 10 }}
    >
      <div className="w-full">
        <form
          className={cx({ hidden: !editable })}
          onSubmit={handleUpdateTaskTitle}
        >
          <Popover.Anchor>
            <input
              className={cx(
                'w-full rounded bg-neutral-100 pl-1 outline outline-2',
                errors.title
                  ? 'text-red-500 focus-visible:outline-red-500'
                  : 'focus-visible:outline-neutral-900',
              )}
              {...register}
              ref={inputRef}
              onBlur={handleBlur}
            />
          </Popover.Anchor>
        </form>
        <label
          htmlFor={id}
          className={cx('cursor-pointer select-none break-all pl-1', {
            hidden: editable,
          })}
          onClick={stopPropagation}
        >
          {title}
        </label>
      </div>
      <Popover.Content>
        <motion.div
          className="rounded-lg bg-neutral-900 px-3 py-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <Popover.Arrow width={10} staticOffset={'10%'} />
          <div className="flex items-end gap-2">
            <div className="flex items-center gap-1 text-red-300">
              <AlertCircleIcon size={15} />
              {errors.title?.type === 'too_small' ? (
                <p>文字列が空です。</p>
              ) : (
                <p>{errors.title?.message}</p>
              )}
            </div>
            <p className="text-xs tabular-nums text-neutral-300">
              文字数: {watch('title').length}
            </p>
          </div>
        </motion.div>
      </Popover.Content>
    </Popover.Root>
  );
};
