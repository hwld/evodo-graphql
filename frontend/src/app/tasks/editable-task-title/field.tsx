import { cx } from "cva";
import { stopPropagation } from "@/lib/utils";
import { TaskTitleForm } from "./task-title-form";
import { useEditableTaskTitle } from "./root";

type Props = { title: string; id: string };

export const _Field: React.FC<Props> = ({ title, id }) => {
  const { editable } = useEditableTaskTitle();

  return (
    <div className="w-full">
      {editable ? (
        <TaskTitleForm taskId={id} defaultValues={{ title }} />
      ) : (
        <label
          htmlFor={id}
          className={cx("cursor-pointer select-none break-all pl-1")}
          onClick={stopPropagation}
        >
          {title}
        </label>
      )}
    </div>
  );
};
