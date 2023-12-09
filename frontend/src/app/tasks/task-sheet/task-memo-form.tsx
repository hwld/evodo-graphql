import { useToast } from "@/app/_components/toast";
import { graphql } from "@/gql";
import { CreateTaskMemoInputSchema } from "@/gql/validator";
import { stopPropagation } from "@/lib/utils";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { cx } from "cva";
import { FocusEventHandler } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Task } from "@/gql/graphql";

const CreateTaskMemoMutation = graphql(`
  mutation CreateTaskMemoMutation($input: CreateTaskMemoInput!) {
    createTaskMemo(input: $input) {
      taskMemo {
        id
        task {
          id
        }
        ...TaskMemoFragment
      }
    }
  }
`);

const createMemoInputSchema = CreateTaskMemoInputSchema().omit({
  taskId: true,
});
type CreateMemoInput = z.infer<typeof createMemoInputSchema>;

type Props = { taskId: string };
export const TaskMemoForm: React.FC<Props> = ({ taskId }) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit: createHandleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<CreateMemoInput>({
    defaultValues: { content: "" },
    resolver: zodResolver(createMemoInputSchema),
  });

  const [createMemoMutate, { loading }] = useMutation(CreateTaskMemoMutation, {
    update: (cache, { data }) => {
      const taskCacheId = cache.identify({
        ...data?.createTaskMemo.taskMemo.task,
      });

      cache.modify({
        id: taskCacheId,
        fields: {
          ["memos" satisfies keyof Task]: (existingMemos) => {
            const memos = existingMemos as Task["memos"];
            const result = {
              ...existingMemos,
              edges: [
                ...memos.edges,
                {
                  node: data?.createTaskMemo.taskMemo,
                  cursor: data?.createTaskMemo.taskMemo.id,
                  __typename: "MemoEdge",
                },
              ],
            } satisfies Task["memos"];
            return result;
          },
        },
      });
    },
    onQueryUpdated: (q) => {
      return q.reobserve();
    },
  });

  const { onBlur, ...otherRegister } = register("content");
  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    onBlur(e);
    clearErrors();
  };

  const handleSubmit = createHandleSubmit(async ({ content }) => {
    await createMemoMutate({
      variables: { input: { taskId, content } },
      onError: () => {
        toast({
          type: "error",
          title: "メモの作成",
          description: "メモが作成できませんでした。",
        });
      },
    });
    reset({ content: "" });
  });

  return (
    <form onSubmit={handleSubmit}>
      <input
        className={cx(
          "w-full rounded border bg-transparent p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          errors.content
            ? "border-red-500 ring-red-300"
            : "border-neutral-300 ring-neutral-500",
        )}
        autoComplete="off"
        placeholder="メモを追加..."
        disabled={loading}
        onBlur={handleBlur}
        {...otherRegister}
        onKeyDown={stopPropagation}
      />
      {errors && (
        <p className="ml-2 mt-2 text-sm text-red-500">
          {errors.content?.message}
        </p>
      )}
    </form>
  );
};
