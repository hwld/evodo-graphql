import { TaskList } from "@/app/tasks/task-list";
import { TaskInput } from "./task-input";
import { UserAuthArea } from "./user-auth-area";
import { RequireAuth } from "../_components/require-auth";

export default function Home() {
  return (
    <RequireAuth>
      <div className="flex h-[100dvh]">
        <div className="bg-neutral-900 flex-shrink-0 w-[300px] p-5">
          <div className="text-neutral-100">evodo-graphql</div>
        </div>
        <main className="grow p-5 flex flex-col gap-5">
          <div className="flex justify-end gap-3">
            <UserAuthArea />
          </div>
          <div className="grow overflow-auto">
            <TaskList />
          </div>
          <TaskInput />
        </main>
      </div>
    </RequireAuth>
  );
}
