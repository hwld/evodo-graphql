import { AlertCircleIcon } from "lucide-react";
import { ReactNode } from "react";

type Props = { label: string; id: string; error?: string; children: ReactNode };

export const InputBase: React.FC<Props> = ({ label, id, error, children }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>{label}</label>
      {children}
      <div className="mt-1 flex h-[20px]  items-center gap-1 text-red-500">
        {error && (
          <>
            <AlertCircleIcon size={15} strokeWidth={3} />
            <p className="text-sm text-red-500">{error}</p>
          </>
        )}
      </div>
    </div>
  );
};
