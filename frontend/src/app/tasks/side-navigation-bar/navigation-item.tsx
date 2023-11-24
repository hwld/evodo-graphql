import { cx } from 'cva';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

type Props = { icon: LucideIcon; active?: boolean; children: ReactNode };

export const NavigationItem: React.FC<Props> = ({
  icon: Icon,
  active,
  children,
}) => {
  return (
    <button
      className={cx(
        'flex w-full items-center justify-start gap-1 rounded p-2 transition-all duration-200',
        'focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2',
        'text-sm focus-visible:outline-none focus-visible:ring-offset-neutral-800',
        { 'pointer-events-none bg-neutral-100 text-neutral-700': active },
        { 'text-neutral-100 hover:bg-white/20': !active },
      )}
      tabIndex={active ? -1 : 0}
    >
      <Icon size={18} />
      {children}
    </button>
  );
};
