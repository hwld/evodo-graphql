import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

type Props = { icon: LucideIcon; label: string; content: ReactNode };
export const TaskSheetRow: React.FC<Props> = ({
  icon: Icon,
  label,
  content,
}) => {
  return (
    <div className="flex h-[30px] grow items-center gap-3">
      <div className="flex w-[150px] flex-shrink-0 items-center  gap-1 text-sm text-neutral-500">
        <Icon size={18} />
        <p>{label}</p>
      </div>
      <div className="grow">{content}</div>
    </div>
  );
};
