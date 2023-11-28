'use client';

import { graphql } from '@/gql';
import { AlertCircleIcon, CommandIcon } from 'lucide-react';
import { useRef } from 'react';
import { useMutation } from 'urql';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CreateTaskInputSchema } from '@/gql/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTaskInputEffect } from './use-task-input-effect';
import {
  useFloating,
  useMergeRefs,
  offset,
  arrow,
  FloatingArrow,
} from '@floating-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {};

const CreateTask = graphql(`
  mutation CreateTaskMutation($input: CreateTaskInput!) {
    createTask(input: $input) {
      task {
        id
      }
    }
  }
`);

const createTaskInputSchema = CreateTaskInputSchema();
type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const TaskInput: React.FC<Props> = () => {
  const [{ fetching }, createTaskMutation] = useMutation(CreateTask);

  const {
    register: _register,
    reset,
    handleSubmit: _handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
  } = useForm<CreateTaskInput>({
    defaultValues: { title: '' },
    resolver: zodResolver(createTaskInputSchema),
    reValidateMode: 'onSubmit',
  });

  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    open: !!errors.title,
    placement: 'top',
    middleware: [offset(15), arrow({ element: arrowRef })],
  });

  const _inputRef = useRef<HTMLInputElement>(null);
  const { ref: _ref, onBlur: _onBlur, ...register } = _register('title');
  const inputRef = useMergeRefs([_inputRef, _ref, refs.setReference]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    _onBlur(e);
    clearErrors();
  };

  const handleCreateTask = _handleSubmit(async (data) => {
    if (fetching) {
      return;
    }

    const result = await createTaskMutation({ input: { title: data.title } });
    if (result.error) {
      window.alert('タスクが入力できませんでした');
      return;
    }

    reset({ title: '' });
  });

  useTaskInputEffect(_inputRef);

  return (
    <>
      <div
        className="flex h-[55px] w-[300px] max-w-full shrink-0 items-center rounded-full bg-neutral-900 px-2 text-neutral-100 
        shadow-lg shadow-neutral-900/20 transition-all duration-200 focus-within:w-[700px]
        focus-within:ring-2 focus-within:ring-neutral-500 focus-within:ring-offset-2"
      >
        <form
          className="flex h-full w-full items-center"
          onSubmit={handleCreateTask}
        >
          <input
            className="w-full bg-transparent px-3 py-3 placeholder:text-neutral-400 focus-visible:outline-none"
            placeholder="タスクを入力してください..."
            {...register}
            ref={inputRef}
            onBlur={handleBlur}
          />
        </form>
        <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center gap-[2px] rounded-full bg-neutral-600 text-neutral-200">
          <CommandIcon size={15} strokeWidth={3} />
          <p className="text-sm font-bold">K</p>
        </div>
      </div>
      <AnimatePresence>
        {!!errors.title && (
          <div ref={refs.setFloating} style={floatingStyles}>
            <motion.div
              className="rounded-lg bg-neutral-900 px-3 py-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
            >
              <FloatingArrow
                ref={arrowRef}
                context={context}
                style={{ height: 10, width: 10 }}
              />
              <div className="flex items-end gap-2">
                <div className="flex items-center gap-1 text-red-300">
                  <AlertCircleIcon size={20} />
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
