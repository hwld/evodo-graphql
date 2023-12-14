import { CalendarIcon, HomeIcon, LayoutListIcon } from "lucide-react";
import { NavigationItem } from "./navigation-item";
import { AppLogo } from "@/app/_components/app-logo";

type Props = {};

export const SideNavigationBar: React.FC<Props> = () => {
  return (
    <div className="h-full w-[300px] flex-shrink-0 border-r-2 border-neutral-300 bg-neutral-800 p-5 text-neutral-100">
      <div className="flex items-center gap-2">
        <AppLogo size={20} />
        <div className="font-bold">evodo</div>
      </div>
      <div className="my-5 h-[1px] w-full bg-neutral-600" />
      <div className="flex flex-col gap-1">
        <NavigationItem active icon={HomeIcon}>
          今日のタスク
        </NavigationItem>
        <NavigationItem icon={LayoutListIcon}>過去のタスク</NavigationItem>
        <NavigationItem icon={CalendarIcon}>予定</NavigationItem>
      </div>
    </div>
  );
};
