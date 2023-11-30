import { LayoutListIcon } from 'lucide-react';

export const EmptyTaskCard = () => {
  return (
    <div className="flex w-full flex-col items-center rounded-lg border border-neutral-300 bg-neutral-100 p-10">
      <div className="flex w-[300px] flex-col items-center justify-center text-center">
        <LayoutListIcon size={100} />
        <p className="mt-5 text-lg font-bold">今日やるべきことはなんですか？</p>
        <p className="mt-2 text-neutral-500">
          `Cmd + K`または`Ctrl + K`で、
          <br />
          タスクの入力を開始できます。
        </p>
      </div>
    </div>
  );
};
