'use client';

import { FragmentType, graphql, useFragment } from '@/gql';
import { TaskCheckbox } from './task-checkbox';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { EditableTaskTitle } from '../editable-task-title/index';
import { useTaskDeleteDialog } from '../task-delete-dialog';
import { IconButton } from '@/app/_components/icon-button';

const TaskItemFragment = graphql(`
  fragment TaskItemFragment on Task {
    id
    title
    detail
    done
    createdAt
    updatedAt
  }
`);

type Props = {
  task: FragmentType<typeof TaskItemFragment>;
};

export const TaskItem: React.FC<Props> = ({ task: _task }) => {
  const task = useFragment(TaskItemFragment, _task);
  const { open: openTaskDeleteDialog } = useTaskDeleteDialog();

  const handleOpenTaskDeleteDialog = () => {
    openTaskDeleteDialog({ taskId: task.id });
  };

  return (
    <EditableTaskTitle.Root>
      <div className="flex justify-between gap-2 rounded border border-neutral-300 bg-neutral-100 p-2">
        <div className="flex grow items-center gap-2">
          <TaskCheckbox id={task.id} done={task.done} />
          <EditableTaskTitle.Field id={task.id} title={task.title} />
        </div>
        <div className="flex gap-1">
          <EditableTaskTitle.Trigger asChild>
            <IconButton icon={PencilIcon} />
          </EditableTaskTitle.Trigger>

          <IconButton icon={TrashIcon} onClick={handleOpenTaskDeleteDialog} />
        </div>
      </div>
    </EditableTaskTitle.Root>
  );
};
