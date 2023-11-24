import { TaskList } from '@/app/tasks/task-list';
import { TaskInput } from './task-input';
import { UserAuthArea } from './user-auth-area';
import { RequireAuth } from '../_components/require-auth';
import { SideNavigationBar } from './side-navigation-bar/side-navigation-bar';
import { MenuButton } from './menu/menu-button';
import { HomeIcon } from 'lucide-react';

export default function Home() {
  return (
    <RequireAuth>
      <div className="flex h-[100dvh]">
        <div className="hidden h-full lg:block">
          <SideNavigationBar />
        </div>
        <main className="relative flex grow flex-col gap-5">
          <div className="absolute right-4 top-2">
            <UserAuthArea />
          </div>
          <div className="overflow-auto p-3">
            <div className="m-auto mt-10 max-w-5xl grow">
              <h1 className="mb-5 flex items-center gap-2 text-xl font-bold">
                <HomeIcon strokeWidth={3} />
                <p>今日のタスク</p>
              </h1>
              <div className="mb-20">
                <TaskList />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 mx-auto my-3 flex max-w-[85%] items-start justify-center gap-2">
            <TaskInput />
            <MenuButton />
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
