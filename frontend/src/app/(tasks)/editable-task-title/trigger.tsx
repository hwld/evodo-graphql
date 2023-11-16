import { ComponentPropsWithoutRef, ReactNode } from "react";
import { useEditableTaskTitleContext } from "./root";

export const _Trigger: React.FC<
  { children: ReactNode } & Omit<ComponentPropsWithoutRef<"button">, "onClick">
> = ({ children, ...props }) => {
  const { enableEditing } = useEditableTaskTitleContext();

  return (
    <button {...props} onClick={enableEditing}>
      {children}
    </button>
  );
};
