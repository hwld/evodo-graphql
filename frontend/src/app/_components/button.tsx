import { VariantProps, cva } from 'cva';
import { LucideIcon } from 'lucide-react';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

const button = cva({
  base: 'rounded transition-all focus-visible:outline-none     focus-visible:ring-2 ring-offset-2 ring-neutral-500 flex items-center gap-1 disabled:opacity-50 disabled:pointer-events-none',
  variants: {
    color: {
      black: 'bg-neutral-800 text-neutral-100 hover:bg-neutral-600',
      white:
        'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300',
    },
    size: {
      md: 'py-2 px-4 text-base',
      sm: 'py-1 px-3 text-sm',
    },
  },
  defaultVariants: {
    color: 'black',
    size: 'md',
  },
});

type Props = {
  children: ReactNode;
  leftIcon?: LucideIcon;
} & ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof button>;

export const Button: React.FC<Props> = ({
  children,
  leftIcon: LeftIcon,
  color,
  size = 'md',
  ...props
}) => {
  const iconSize = {
    md: '20',
    sm: '18',
  };

  return (
    <button {...props} className={button({ color, size })}>
      {LeftIcon && <LeftIcon size={iconSize[size]} />}
      {children}
    </button>
  );
};
