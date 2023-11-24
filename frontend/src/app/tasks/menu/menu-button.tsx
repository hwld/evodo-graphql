'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  CalendarIcon,
  HomeIcon,
  LayoutListIcon,
  MoreHorizontalIcon,
} from 'lucide-react';
import { MenuItem } from './menu-item';

type Props = {};

export const MenuButton: React.FC<Props> = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900
          text-neutral-200 transition-all duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-neutral-500 focus-within:ring-offset-2 hover:bg-neutral-700"
        >
          <MoreHorizontalIcon size="60%" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="data-[state=open]:animate-popoverEnter data-[state=closed]:animate-popoverExit min-w-[300px] origin-[100%_100%] rounded-lg bg-neutral-900 p-3 transition-all duration-200"
          sideOffset={12}
          side="top"
          align="end"
        >
          <MenuItem icon={<HomeIcon />}>今日のタスク</MenuItem>
          <MenuItem icon={<LayoutListIcon />}>過去のタスク</MenuItem>
          <MenuItem icon={<CalendarIcon />}>予定</MenuItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
