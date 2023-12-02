'use client';

import { FragmentType, graphql, useFragment } from '@/gql';
import { TaskCheckbox } from './task-checkbox';
import { PanelRightOpenIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { EditableTaskTitle } from '../editable-task-title/index';
import { useTaskDeleteDialog } from '../task-delete-dialog';
import { IconButton } from '@/app/_components/icon-button';
import { useState } from 'react';
import { TaskDetailSheetContent } from './task-detail-sheet-content';
import { Sheet } from '@/app/_components/sheet';
import { Tooltip } from '@/app/_components/tooltip';

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleOpenTaskDeleteDialog = () => {
    openTaskDeleteDialog({ taskId: task.id });
  };

  return (
    <EditableTaskTitle.Root>
      <div className="flex justify-between gap-2 rounded border border-neutral-300 bg-neutral-100 px-3 py-2">
        <div className="flex grow items-center gap-2">
          <TaskCheckbox id={task.id} done={task.done} />
          <EditableTaskTitle.Field id={task.id} title={task.title} />
        </div>
        <div className="flex items-center gap-1">
          <Tooltip label="タイトルを編集する">
            <EditableTaskTitle.Trigger asChild>
              <IconButton icon={PencilIcon} />
            </EditableTaskTitle.Trigger>
          </Tooltip>
          <Tooltip label="削除する">
            <IconButton icon={TrashIcon} onClick={handleOpenTaskDeleteDialog} />
          </Tooltip>
          <Tooltip label="詳細を開く">
            <IconButton
              icon={PanelRightOpenIcon}
              onClick={() => setIsSheetOpen(true)}
            />
          </Tooltip>
        </div>
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <TaskDetailSheetContent task={task} />
      </Sheet>
    </EditableTaskTitle.Root>
  );
};
