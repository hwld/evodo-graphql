import { TaskItemFragmentFragment } from '@/gql/graphql';
import { TaskCheckbox } from './task-checkbox';
import { EditableTaskDetail } from './editable-task-detail';

type Props = {
  task: TaskItemFragmentFragment;
};

export const TaskDetailSheetContent: React.FC<Props> = ({ task }) => {
  return (
    <div className="flex h-full flex-col">
      <p className="text-neutral-500">task-title</p>
      <div className="mt-1 flex items-center gap-2">
        <TaskCheckbox
          id={task.id}
          checkboxId={`sheet-${task.id}`}
          done={task.done}
        />
        <label
          htmlFor={`sheet-${task.id}`}
          className="cursor-pointer text-2xl font-bold"
        >
          {task.title}
        </label>
      </div>

      <div className="mt-5">
        <EditableTaskDetail task={task} />
      </div>
      <div className="mt-5">
        <div className="text-neutral-500">コメント</div>
        <div className="my-2 h-[1px] w-full bg-neutral-200" />
      </div>
    </div>
  );
};
