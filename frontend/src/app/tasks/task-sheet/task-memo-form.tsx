import { useToast } from "@/app/_components/toast";
import { graphql } from "@/gql";
import { CreateTaskMemoInputSchema } from "@/gql/validator";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreateTaskMemoMutation = graphql(`
  mutation CreateTaskMemoMutation($input: CreateTaskMemoInput!) {
    createTaskMemo(input: $input) {
      taskMemo {
        id
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
  } = useForm<CreateMemoInput>({
    defaultValues: { content: "" },
    resolver: zodResolver(createMemoInputSchema),
  });
  const [createMemoMutate, { loading }] = useMutation(CreateTaskMemoMutation);

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
      <input disabled={loading} {...register("content")} />
    </form>
  );
};
