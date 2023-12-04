import { Button } from "@/app/_components/button";
import { graphql } from "@/gql";
import { UpdateTaskDescriptionInputSchema } from "@/gql/validator";
import { stopPropagation } from "@/lib/utils";
import { useMutation } from "@apollo/client";
import { useMergeRefs } from "@floating-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { cx } from "cva";
import { motion } from "framer-motion";
import { AlertCircleIcon, SaveIcon } from "lucide-react";
import { forwardRef, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  taskId: string;
  defaultValues?: UpdateTaskDescriptionInput;
  disableEditing: () => void;
};
export const TaskDescriptionForm = forwardRef<HTMLTextAreaElement, Props>(
  function TaskDescriptionForm({ taskId, defaultValues, disableEditing }, ref) {
    const [updateTaskDescription, { loading: updating }] = useMutation(
      UpdateTaskDescriptionMutation,
    );

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<UpdateTaskDescriptionInput>({
      defaultValues,
      resolver: zodResolver(updateTaskDescriptionInputSchema),
    });

    const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
    const { ref: _ref, onChange, ...others } = register("description");
    const textareaRef = useMergeRefs([ref, _ref]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // min-heightに合わせる
      e.target.style.height = "100px";
      e.target.style.height = `${e.target.scrollHeight}px`;
      onChange(e);
    };

    const handleUpdateTaskDescription = handleSubmit(
      async ({ description }) => {
        updateTaskDescription({
          variables: { input: { id: taskId, description } },
          optimisticResponse: {
            updateTaskDescription: {
              task: {
                __typename: "Task",
                description: description,
                id: taskId,
              },
            },
          },
          onError: () => {
            window.alert("タスクの説明を更新できませんでした。");
            setTimeout(() => descriptionTextareaRef.current?.focus(), 0);
          },
        });

        disableEditing();
      },
    );

    return (
      <motion.div className="relative">
        <form className="flex w-full flex-col">
          <textarea
            className={cx(
              "min-h-[100px] resize-none overflow-hidden rounded-lg border-neutral-300 bg-neutral-50 p-3 outline outline-2",
              errors.description ? "outline-red-500" : "outline-neutral-300",
            )}
            ref={textareaRef}
            onChange={handleChange}
            onKeyDown={stopPropagation}
            disabled={updating}
            placeholder="タスクの説明を入力してください..."
            {...others}
          ></textarea>
        </form>
        <motion.div
          className="absolute right-0 mt-1 flex w-full items-start justify-between gap-3 overflow-hidden rounded"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <div>
            {errors.description && (
              <div className="flex items-start gap-1 rounded bg-neutral-900 p-3 text-red-300">
                <AlertCircleIcon size={20} className="flex-shrink-0" />
                <p className="text-sm">{errors.description?.message}</p>
              </div>
            )}
          </div>
          <fieldset
            className="m-1 flex flex-shrink-0 items-center gap-1 rounded"
            disabled={updating}
          >
            <Button
              color="white"
              size="sm"
              onClick={disableEditing}
              type="button"
            >
              キャンセル
            </Button>
            <Button
              size="sm"
              type="submit"
              color="black"
              debouncedIsLoading={updating}
              leftIcon={SaveIcon}
              onClick={handleUpdateTaskDescription}
            >
              保存する
            </Button>
          </fieldset>
        </motion.div>
      </motion.div>
    );
  },
);
