import { VariantProps, cva } from 'cva';
import { LucideIcon } from 'lucide-react';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

const iconButton = cva({
  base: 'flex items-center justify-center bg-transparent hover:bg-neutral-200 transition-all rounded disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 ring-offset-2 ring-neutral-500 text-neutral-700',
  variants: { size: { md: 'p-1 w-[30px] h-[30px]' } },
  defaultVariants: { size: 'md' },
});

type Props = { icon: LucideIcon } & VariantProps<typeof iconButton> &
  ComponentPropsWithoutRef<'button'>;

export const IconButton: React.FC<Props> = forwardRef<HTMLButtonElement, Props>(
  function IconButton({ icon: Icon, size, onClick, ...props }, ref) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        {...props}
        className={iconButton({ size })}
      >
        <Icon size={20} />
      </button>
    );
  },
);
