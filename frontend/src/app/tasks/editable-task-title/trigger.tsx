import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { useEditableTaskTitle } from "./root";

type Props = {
  children: ReactNode;
  asChild?: boolean;
} & ComponentPropsWithoutRef<"button">;

export const _Trigger: React.FC<Props> = forwardRef<HTMLButtonElement, Props>(
  function _Trigger({ children, asChild, onClick, ...props }, ref) {
    const { enableEditing } = useEditableTaskTitle();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      enableEditing();
    };

    const Component = asChild ? Slot : "button";
    return (
      <Component {...props} ref={ref} onClick={handleClick}>
        {children}
      </Component>
    );
  },
);
