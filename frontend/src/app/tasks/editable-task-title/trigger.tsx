import { ReactNode } from "react";
import { useEditableTaskTitleContext } from "./root";
import { Slot } from "@radix-ui/react-slot";

type Props = { children: ReactNode; asChild?: boolean };

export const _Trigger: React.FC<Props> = ({ children, asChild }) => {
  const { enableEditing } = useEditableTaskTitleContext();

  const Component = asChild ? Slot : "button";

  return <Component onClick={enableEditing}>{children}</Component>;
};
