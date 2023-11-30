'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import { useRef } from 'react';
import { cx } from 'cva';
import { useToggleTaskDone } from './use-toggle-task-done';

type Animation = [Keyframe[], KeyframeAnimationOptions];
const doneAnimation: Animation = [
  [
    { transform: 'scale(0.5)' },
    { transform: 'scale(1.2)' },
    { transform: 'scale(1)' },
  ],
  { duration: 250, easing: 'ease-out' },
];
const undoneAnimation: Animation = [
  [{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }],
  { duration: 150, easing: 'ease-out' },
];

type Props = { id: string; done: boolean };
export const TaskCheckbox: React.FC<Props> = ({ id, done }) => {
  const checkboxRef = useRef<HTMLButtonElement>(null);
  const { toggleTaskDone, isToggling } = useToggleTaskDone({
    taskId: id,
    done,
  });

  const handleToggleTaskDone = async () => {
    const willDone = !done;

    checkboxRef.current?.animate(
      ...(willDone ? doneAnimation : undoneAnimation),
    );

    const result = await toggleTaskDone();
    if (result.error) {
      window.alert('タスクを更新できませんでした。');
      return;
    }
  };

  return (
    <>
      <Checkbox.Root
        ref={checkboxRef}
        id={id}
        checked={done}
        onCheckedChange={handleToggleTaskDone}
        disabled={isToggling}
        className={cx(
          'group h-[25px] w-[25px] rounded-full border-2 border-neutral-700 bg-neutral-100 text-neutral-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 disabled:opacity-50 data-[state=checked]:bg-neutral-900',
          { 'hover:bg-neutral-200': !done },
        )}
      >
        <Checkbox.Indicator
          className="flex items-center justify-center"
          forceMount
        >
          <CheckIcon
            size="80%"
            className={cx('transition-all duration-300', {
              'group-hover:text-neutral-600': !done,
            })}
          />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </>
  );
};
