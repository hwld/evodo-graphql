import { TaskItemFragmentFragment } from '@/gql/graphql';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { useForm } from 'react-hook-form';
import { UpdateTaskDetailInputSchema } from '@/gql/validator';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMergeRefs } from '@floating-ui/react';
import { cx } from 'cva';
import { AlertCircleIcon } from 'lucide-react';
import { Button } from '@/app/_components/button';
import { forwardRef } from 'react';

const UpdateTaskDetailMutation = graphql(`
  mutation UpdateTaskDetailMutation($input: UpdateTaskDetailInput!) {
    updateTaskDetail(input: $input) {
      task {
        id
      }
    }
  }
`);

const updateTaskDetailInputSchema = UpdateTaskDetailInputSchema().omit({
  id: true,
});
type UpdateTaskDetailInput = z.infer<typeof updateTaskDetailInputSchema>;

type Props = { task: TaskItemFragmentFragment; onDisabledEditable: () => void };

export const TaskDetailForm = forwardRef<HTMLTextAreaElement, Props>(
  function TaskDetailForm({ task, onDisabledEditable }, ref) {
    const [{ fetching: updateting }, updateTaskDetail] = useMutation(
      UpdateTaskDetailMutation,
    );
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<UpdateTaskDetailInput>({
      defaultValues: { detail: task.detail },
      resolver: zodResolver(updateTaskDetailInputSchema),
    });

    const { ref: _ref, onChange, ...others } = register('detail');
    const textareaRef = useMergeRefs([ref, _ref]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      // min-heightに合わせる
      e.target.style.height = '100px';
      e.target.style.height = `${e.target.scrollHeight}px`;
      onChange(e);
    };

    const handleUpdateTaskDetail = handleSubmit(async ({ detail }) => {
      const result = await updateTaskDetail({ input: { id: task.id, detail } });
      if (result.error) {
        window.alert('タスクを更新できませんでした。');
        return;
      }

      onDisabledEditable();
    });

    const handleCancel = () => {
      onDisabledEditable();
    };

    return (
      <form className="flex w-full flex-col" onSubmit={handleUpdateTaskDetail}>
        <textarea
          className={cx(
            'min-h-[100px] resize-none overflow-hidden rounded-lg border-neutral-300 bg-neutral-50 p-3 outline outline-2 disabled:cursor-not-allowed disabled:opacity-50',
            errors.detail ? 'outline-red-500' : 'outline-neutral-300',
          )}
          ref={textareaRef}
          onChange={handleChange}
          {...others}
          disabled={updateting}
        ></textarea>
        <div className="mt-2 flex w-full items-start justify-between gap-1">
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
            disabled={updateting}
          >
            <Button
              color="white"
              size="sm"
              onClick={handleCancel}
              type="button"
            >
              キャンセル
            </Button>
            <Button size="sm" type="submit">
              保存する
            </Button>
          </fieldset>
        </div>
      </form>
    );
  },
);
