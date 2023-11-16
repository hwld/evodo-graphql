import { TaskList } from "@/app/(tasks)/task-list";
import { TaskInput } from "./task-input";

export default function Home() {
  return (
    <div className="flex h-[100dvh]">
      <div className="bg-neutral-900 flex-shrink-0 w-[300px] p-5">
        <div>evodo-graphql</div>
      </div>
      <main className="bg-neutral-200 grow text-neutral-700 p-5">
        <div className="grow">
          <TaskList />
        </div>
        <TaskInput />
      </main>
    </div>
  );
}
