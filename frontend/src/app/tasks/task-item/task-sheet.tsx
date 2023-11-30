import { Sheet } from '@/app/_components/sheet';
import { TaskItemFragmentFragment } from '@/gql/graphql';
import { TaskCheckbox } from './task-checkbox';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TaskDetailForm } from './task-detail-form';
import { cx } from 'cva';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  task: TaskItemFragmentFragment;
};

export const TaskSheet: React.FC<Props> = ({ open, onOpenChange, task }) => {
  const detailTextareaRef = useRef<HTMLTextAreaElement>(null);
  const detailTextRef = useRef<HTMLDivElement>(null);
  const [editable, setEditable] = useState(false);
  const textHeightRef = useRef(0);

  const handleClickDetail = () => {
    setEditable(true);
    setTimeout(() => {
      detailTextareaRef.current?.focus();
    }, 0);
  };

  // editableに変わったときにformに渡す高さをここでセットする
  useEffect(() => {
    if (!detailTextRef.current) {
      return;
    }
    const h = detailTextRef.current.clientHeight;
    if (h !== textHeightRef.current) {
      textHeightRef.current = h;
    }
  });

  useLayoutEffect(() => {
    if (!detailTextareaRef.current) {
      return;
    }
    // この時点でdetailTextのheightは0になっているので、事前にセットした高さを使用する
    detailTextareaRef.current.style.height = `${textHeightRef.current}px`;
  }, [editable]);

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
        {editable ? (
          <div className={cx('mt-5')}>
            <TaskDetailForm
              ref={detailTextareaRef}
              task={task}
              onDisabledEditable={() => setEditable(false)}
            />
          </div>
        ) : (
          <div
            ref={detailTextRef}
            className={cx(
              'relative mt-5 min-h-[100px] overflow-hidden rounded-lg p-3 outline outline-2 outline-neutral-300',
            )}
            onClick={handleClickDetail}
          >
            <p className="whitespace-pre">{task.detail}</p>
          </div>
        )}
      </div>
    </Sheet>
  );
};
