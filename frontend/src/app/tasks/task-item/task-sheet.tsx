import { Sheet } from '@/app/_components/sheet';
import { TaskItemFragmentFragment } from '@/gql/graphql';
import { TaskCheckbox } from './task-checkbox';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task: TaskItemFragmentFragment;
};
export const TaskSheet: React.FC<Props> = ({ open, onOpenChange, task }) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
        <div className="mt-5 w-full grow rounded-lg border-2 border-neutral-300">
          {task.detail}
        </div>
      </div>
    </Sheet>
  );
};
