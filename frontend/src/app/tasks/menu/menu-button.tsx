"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  CalendarIcon,
  HomeIcon,
  LayoutListIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { MenuItem } from "./menu-item";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {};

export const MenuButton: React.FC<Props> = () => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900
          text-neutral-200 shadow-md shadow-neutral-900/20 transition-all duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-neutral-500 focus-within:ring-offset-2 hover:bg-neutral-700"
        >
          <MoreHorizontalIcon size="60%" />
        </button>
      </DropdownMenu.Trigger>
      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              sideOffset={12}
              side="top"
              align="end"
              asChild
            >
              <motion.div
                className="min-w-[300px] origin-[100%_100%] rounded-lg bg-neutral-900 p-3"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
              >
                <MenuItem icon={<HomeIcon />}>今日のタスク</MenuItem>
                <MenuItem icon={<LayoutListIcon />}>過去のタスク</MenuItem>
                <MenuItem icon={<CalendarIcon />}>予定</MenuItem>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
};
