import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { cx } from 'cva';
import { useEditableTaskTitle } from './state';
import { useForm } from 'react-hook-form';
import { UpdateTaskTitleInputSchema } from '@/gql/validator';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  FloatingArrow,
  arrow,
  autoUpdate,
  offset,
  useFloating,
  useMergeRefs,
} from '@floating-ui/react';
import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircleIcon } from 'lucide-react';

const UpdateTaskTitle = graphql(`
  mutation UpdateTaskTitleMutation($input: UpdateTaskTitleInput!) {
    updateTaskTitle(input: $input) {
      task {
        id
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
  const [{ fetching: updating }, updateTaskTitleMutation] =
    useMutation(UpdateTaskTitle);

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

  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    open: !!errors.title,
    middleware: [offset(13), arrow({ element: arrowRef, padding: 10 })],
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
  });

  // TODO
  //　ここどうにかしたい。refをjotaiで管理してるから、setInputElで再レンダリングが発生しちゃって
  // 無限ループになるので、再レンダリングの原因になるregisterが返すrefをメモ化する
  const { ref: _ref, onBlur, ...register } = _register('title');
  const inputRef = useMergeRefs([_inputRef, _ref, refs.setReference]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(e);
    disableEditing();
    setValue('title', title);
    clearErrors();
  };

  const handleUpdateTaskTitle = _handleSubmit(async (data) => {
    const result = await updateTaskTitleMutation({
      input: {
        id,
        title: data.title,
      },
    });
    if (result.error) {
      window.alert('タスク名を変えられませんでした');
      _inputRef?.current?.focus();
      return;
    }

    disableEditing();
  });

  return (
    <>
      <div className="w-full">
        <form
          className={cx({ hidden: !editable })}
          onSubmit={handleUpdateTaskTitle}
        >
          <input
            className={cx(
              'w-full rounded bg-neutral-100 pl-1',
              errors.title
                ? 'text-red-500 focus-visible:outline-red-500'
                : 'focus-visible:outline-neutral-900',
            )}
            disabled={updating}
            {...register}
            ref={inputRef}
            onBlur={handleBlur}
          />
        </form>
        <label
          htmlFor={id}
          className={cx('cursor-pointer select-none pl-1', {
            hidden: editable,
          })}
        >
          {title}
        </label>
      </div>
      <AnimatePresence>
        {!!errors.title && (
          <div ref={refs.setFloating} style={floatingStyles}>
            <motion.div
              className="rounded-lg bg-neutral-900 px-3 py-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
            >
              <FloatingArrow
                ref={arrowRef}
                context={context}
                width={10}
                staticOffset={'10%'}
              />
              <div className="flex items-end gap-2">
                <div className="flex items-center gap-1 text-sm text-red-300">
                  <AlertCircleIcon size={15} />
                  {errors.title.type === 'too_small' ? (
                    <p>文字列が空です。</p>
                  ) : (
                    <p>{errors.title.message}</p>
                  )}
                </div>
                <p className="text-xs tabular-nums text-neutral-300">
                  文字数: {watch('title').length}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
