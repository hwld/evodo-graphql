import { cx } from 'cva';
import { LucideIcon } from 'lucide-react';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

type Props = {
  icon: LucideIcon;
  size?: 'md';
} & ComponentPropsWithoutRef<'button'>;

export const IconButton: React.FC<Props> = forwardRef<HTMLButtonElement, Props>(
  function IconButton({ icon: Icon, size = 'md', onClick, ...props }, ref) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        {...props}
        className={cx(
          'flex items-center justify-center rounded bg-transparent text-neutral-700 ring-neutral-500 ring-offset-2 transition-all hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
          { md: 'h-[30px] w-[30px] p-1' }[size],
        )}
      >
        <Icon size={20} />
      </button>
    );
  },
);
