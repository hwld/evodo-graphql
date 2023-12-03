'use client';

import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import { cx } from 'cva';
import { useToggleTaskDone } from './use-toggle-task-done';
import { motion } from 'framer-motion';

type Props = { id: string; done: boolean; checkboxId?: string };
export const TaskCheckbox: React.FC<Props> = ({
  id,
  done,
  checkboxId = id,
}) => {
  const { toggleTaskDone, isToggling } = useToggleTaskDone({
    taskId: id,
    done,
  });

  const handleToggleTaskDone = async () => {
    toggleTaskDone({
      onError: () => {
        window.alert('タスクを更新できませんでした。');
      },
    });
  };

  return (
    <>
      <Checkbox.Root
        id={checkboxId}
        checked={done}
        onCheckedChange={handleToggleTaskDone}
        disabled={isToggling}
        className={cx(
          'group relative h-[25px] w-[25px] shrink-0 rounded-full border-2 border-neutral-700 bg-neutral-100 text-neutral-100 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 disabled:opacity-50 data-[state=checked]:bg-neutral-900',
          { 'hover:bg-neutral-200': !done && !isToggling },
        )}
      >
        {done && (
          <motion.div
            className="absolute inset-0 rounded-full bg-neutral-900"
            initial={{ scale: 1 }}
            animate={{ scale: 1.6, opacity: 0 }}
          />
        )}
        <Checkbox.Indicator
          className="flex items-center justify-center"
          forceMount
        >
          <CheckIcon
            size="80%"
            className={cx('transition-all duration-300', {
              'group-hover:text-neutral-600': !done && !isToggling,
            })}
          />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </>
  );
};
