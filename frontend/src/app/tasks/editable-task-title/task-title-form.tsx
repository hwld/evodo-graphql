import { graphql } from "@/gql";
import { UpdateTaskTitleInputSchema } from "@/gql/validator";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEditableTaskTitle } from "./root";
import { cx } from "cva";
import { useMergeRefs } from "@floating-ui/react";
import { Popover } from "@/app/_components/popover";
import { motion } from "framer-motion";
import { AlertCircleIcon } from "lucide-react";

const UpdateTaskTitleMutation = graphql(`
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

type Props = { taskId: string; defaultValues?: UpdateTaskTitleInput };

export const TaskTitleForm: React.FC<Props> = ({ taskId, defaultValues }) => {
  const { inputRef: editableInputRef, disableEditing } = useEditableTaskTitle();

  const [updateTaskTitle] = useMutation(UpdateTaskTitleMutation);

  const {
    register,
    handleSubmit: handleSubmitFactory,
    formState: { errors },
    watch,
  } = useForm<UpdateTaskTitleInput>({
    defaultValues,
    resolver: zodResolver(updateTaskTitleInputSchema),
  });

  const { ref: titleRegisterRef, onBlur, ...otherRegister } = register("title");
  const inputRef = useMergeRefs([editableInputRef, titleRegisterRef]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur(e);
    disableEditing();
  };

  const handleUpdateTaskTitle = handleSubmitFactory(async (data) => {
    updateTaskTitle({
      variables: {
        input: {
          id: taskId,
          title: data.title,
        },
      },
      optimisticResponse: {
        updateTaskTitle: {
          task: { __typename: "Task", id: taskId, title: data.title },
        },
      },
      onError: () => {
        window.alert("タスク名を変更できませんでした。");
        setTimeout(() => editableInputRef?.current?.focus(), 0);
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
      <form onSubmit={handleUpdateTaskTitle}>
        <Popover.Anchor>
          <input
            className={cx(
              "w-full rounded bg-neutral-100 pl-1 outline outline-2",
              errors.title
                ? "text-red-500 focus-visible:outline-red-500"
                : "focus-visible:outline-neutral-900",
            )}
            {...otherRegister}
            ref={inputRef}
            onBlur={handleBlur}
          />
        </Popover.Anchor>
      </form>
      <Popover.Content>
        <motion.div
          className="rounded-lg bg-neutral-900 px-3 py-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          <Popover.Arrow width={10} staticOffset={"10%"} />
          <div className="flex items-end gap-2">
            <div className="flex items-center gap-1 text-red-300">
              <AlertCircleIcon size={15} />
              {/* 
                graphqlのスキーマから自動生成したバリデータではエラーメッセージを柔軟に変えることができなそうなので、too_smallの場合はmin(1)だと
                仮定してエラーメッセージを設定する
              */}
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
