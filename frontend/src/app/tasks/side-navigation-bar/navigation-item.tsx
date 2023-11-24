import clsx from 'clsx';
import { ReactNode } from 'react';

type Props = { icon: ReactNode; active?: boolean; children: ReactNode };

export const NavigationItem: React.FC<Props> = ({ icon, active, children }) => {
  return (
    <button
      className={clsx(
        'flex w-full items-center justify-start gap-2 rounded p-3 transition-all duration-200',
        'focus-visible:ring-2 focus-visible:ring-neutral-100 focus-visible:ring-offset-2',
        'focus-visible:outline-none focus-visible:ring-offset-neutral-800',
        { 'pointer-events-none bg-neutral-100 text-neutral-700': active },
        { 'text-neutral-100 hover:bg-white/20': !active },
      )}
      tabIndex={active ? -1 : 0}
    >
      {icon}
      {children}
    </button>
  );
};
