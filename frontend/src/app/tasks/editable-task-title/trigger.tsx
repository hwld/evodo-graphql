import { ComponentPropsWithoutRef, ReactNode } from "react";
import { useEditableTaskTitleContext } from "./root";

type Props = { children: ReactNode } & Omit<
  ComponentPropsWithoutRef<"button">,
  "onClick"
>;

export const _Trigger: React.FC<Props> = ({ children, ...props }) => {
  const { enableEditing } = useEditableTaskTitleContext();

  return (
    <button {...props} onClick={enableEditing} tabIndex={-1}>
      {children}
    </button>
  );
};
