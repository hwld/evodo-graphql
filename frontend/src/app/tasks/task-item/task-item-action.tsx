import { LucideIcon } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

type Props = { icon: LucideIcon } & Omit<
  ComponentPropsWithoutRef<"button">,
  "className"
>;

export const TaskItemAction: React.FC<Props> = ({ icon: Icon, ...props }) => {
  return (
    <button
      {...props}
      className="flex h-[28px] w-[28px] items-center justify-center rounded p-1
      transition-all hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-neutral-500 focus-visible:ring-offset-2"
    >
      <Icon />
    </button>
  );
};
