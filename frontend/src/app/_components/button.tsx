import { useDebouncedValue } from "@mantine/hooks";
import { cx } from "cva";
import { Loader2Icon, LucideIcon } from "lucide-react";
import { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = {
  children: ReactNode;
  leftIcon?: LucideIcon;
  debouncedIsLoading?: boolean;
  size?: "md" | "sm";
  color?: "black" | "white";
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

export const Button: React.FC<Props> = ({
  children,
  leftIcon: LeftIcon,
  disabled,
  debouncedIsLoading: isLoading = false,
  color = "black",
  size = "md",
  ...props
}) => {
  const [debouncedIsLoading] = useDebouncedValue(isLoading, 500);

  const iconSize = {
    md: "20",
    sm: "18",
  };

  return (
    <button
      disabled={isLoading || disabled}
      {...props}
      className={cx(
        "flex items-center gap-1 rounded ring-neutral-500 ring-offset-2 ring-offset-neutral-200 transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        {
          white:
            "border border-neutral-300 bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
          black: "bg-neutral-800 text-neutral-100 hover:bg-neutral-600",
        }[color],
        {
          md: "px-4 py-2 text-base",
          sm: "px-3 py-1 text-sm",
        }[size],
      )}
    >
      {debouncedIsLoading && (
        <Loader2Icon
          size={cx(iconSize[size])}
          className="animate-spin"
          strokeWidth={3}
        />
      )}
      {LeftIcon && !debouncedIsLoading && <LeftIcon size={iconSize[size]} />}
      {children}
    </button>
  );
};
