import { cx } from "cva";
import { LucideIcon } from "lucide-react";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = {
  icon: LucideIcon;
  color?: "black" | "white";
  size?: "md" | "sm";
} & ComponentPropsWithoutRef<"button">;

export const IconButton: React.FC<Props> = forwardRef<HTMLButtonElement, Props>(
  function IconButton(
    { icon: Icon, color = "black", size = "md", onClick, ...props },
    ref,
  ) {
    const colorClass = {
      white: "text-neutral-100 hover:bg-neutral-700",
      black: "text-neutral-700 hover:bg-neutral-200",
    };
    const sizeClass = { md: "h-[30px] w-[30px] p-1", sm: "h-[25px] w-[25px]" };
    const iconSize = { md: 20, sm: 18 };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        {...props}
        className={cx(
          "flex shrink-0 items-center justify-center rounded bg-transparent ring-neutral-500 ring-offset-2 transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
          sizeClass[size],
          colorClass[color],
        )}
      >
        <Icon size={iconSize[size]} />
      </button>
    );
  },
);
