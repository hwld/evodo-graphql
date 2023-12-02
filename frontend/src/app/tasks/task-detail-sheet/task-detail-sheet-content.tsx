import { TaskItemFragmentFragment } from '@/gql/graphql';
import { TaskCheckbox } from '../task-item/task-checkbox';
import { EditableTaskDetail } from './editable-task-detail';
import { Clock8Icon, LucideIcon, RotateCcwIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { DateTime } from '@/app/_components/date-time';

type Props = {
  task: TaskItemFragmentFragment;
};

export const TaskDetailSheetContent: React.FC<Props> = ({ task }) => {
  return (
    <div className="flex flex-col gap-8">
      <div>
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
        <div className="mt-1 h-[1px] bg-neutral-200" />
      </div>

      <div className="flex flex-col gap-2">
        <TaskDetailSheetRow
          icon={Clock8Icon}
          label="作成した日時"
          content={<DateTime dateTime={new Date(task.createdAt)} />}
        />
        <TaskDetailSheetRow
          icon={RotateCcwIcon}
          label="更新した日時"
          content={<DateTime dateTime={new Date(task.updatedAt)} />}
        />
        <div className="h-[1px] bg-neutral-200" />
      </div>

      <div>
        <EditableTaskDetail task={task} />
      </div>

      <div className="-mt-5">
        <div className="text-neutral-500">コメント</div>
        <div className="my-2 h-[1px] w-full bg-neutral-200" />
      </div>
    </div>
  );
};

type P = { icon: LucideIcon; label: string; content: ReactNode };
const TaskDetailSheetRow: React.FC<P> = ({ icon: Icon, label, content }) => {
  return (
    <div className="flex h-[30px] grow items-center gap-3">
      <div className="flex w-[150px] flex-shrink-0 items-center  gap-1 text-sm text-neutral-500">
        <Icon size={18} />
        <p>{label}</p>
      </div>
      <div className="grow">{content}</div>
    </div>
  );
};
