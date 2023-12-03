"use client";

import { graphql } from "@/gql";
import { AlertCircleIcon, CommandIcon } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateTaskInputSchema } from "@/gql/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTaskInputEffect } from "./use-task-input-effect";
import { useMergeRefs } from "@floating-ui/react";
import { motion } from "framer-motion";
import { cx } from "cva";
import { Popover } from "@/app/_components/popover";
import { useMutation } from "@apollo/client";

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
  const [createTaskMutation, { loading }] = useMutation(CreateTask);

  const {
    register: _register,
    reset,
    handleSubmit: _handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
  } = useForm<CreateTaskInput>({
    defaultValues: { title: "" },
    resolver: zodResolver(createTaskInputSchema),
  });

  const _inputRef = useRef<HTMLInputElement>(null);
  const { ref: _ref, onBlur: _onBlur, ...register } = _register("title");
  const inputRef = useMergeRefs([_inputRef, _ref]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    _onBlur(e);
    clearErrors();
  };

  const handleCreateTask = _handleSubmit(async (data) => {
    if (loading) {
      return;
    }

    const result = await createTaskMutation({
      variables: { input: { title: data.title } },
      onError: () => {},
    });

    if (result.errors) {
      window.alert("タスクが入力できませんでした");
      return;
    }

    reset({ title: "" });
  });

  useTaskInputEffect(_inputRef);

  return (
    <Popover.Root isOpen={!!errors.title} placement="top">
      <div
        className={cx(
          "flex h-[45px] w-[300px] max-w-full shrink-0 items-center rounded-full bg-neutral-900 px-2 text-neutral-100 shadow-lg shadow-neutral-900/20 transition-all duration-200 focus-within:w-[700px] focus-within:ring-2 focus-within:ring-offset-2",
          errors.title
            ? "text-red-500 focus-within:ring-red-600"
            : "text-neutral-100 focus-within:ring-neutral-500",
        )}
      >
        <form
          className="flex h-full w-full items-center"
          onSubmit={handleCreateTask}
        >
          <Popover.Anchor>
            <input
              className="w-full bg-transparent px-3 py-3 placeholder:text-neutral-400 focus-visible:outline-none"
              placeholder="タスクを入力してください..."
              {...register}
              ref={inputRef}
              onBlur={handleBlur}
            />
          </Popover.Anchor>
        </form>
        <div className="flex h-[32px] w-[50px] shrink-0 items-center justify-center gap-[2px] rounded-full border-2 border-neutral-200 text-neutral-200">
          <CommandIcon size={15} strokeWidth={3} />
          <p className="text-sm font-bold">K</p>
        </div>
      </div>
      <Popover.Content>
        <motion.div
          className="rounded-lg bg-neutral-900 px-3 py-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
        >
          <Popover.Arrow />
          <div className="flex items-end gap-2">
            <div className="flex items-center gap-1 text-red-300">
              <AlertCircleIcon size={20} />
              {errors.title?.type === "too_small" ? (
                <p>文字列が空です。</p>
              ) : (
                <p>{errors.title?.message}</p>
              )}
            </div>
            <p className="text-xs tabular-nums text-neutral-300">
              文字数: {watch("title").length}
            </p>
          </div>
        </motion.div>
      </Popover.Content>
    </Popover.Root>
  );
};
