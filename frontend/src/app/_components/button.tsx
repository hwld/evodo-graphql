import { useDebouncedValue } from '@mantine/hooks';
import { VariantProps, cva } from 'cva';
import { Loader2Icon, LucideIcon } from 'lucide-react';
import { ComponentPropsWithoutRef, ReactNode } from 'react';

const button = cva({
  base: 'rounded transition-all focus-visible:outline-none focus-visible:ring-2 ring-offset-2 flex items-center gap-1 disabled:opacity-50 disabled:pointer-events-none ring-offset-neutral-200 ring-neutral-500 disabled:cursor-not-allowed',
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

const iconSize = {
  md: '20',
  sm: '18',
};

type Props = {
  children: ReactNode;
  leftIcon?: LucideIcon;
  debouncedIsLoading?: boolean;
} & Omit<ComponentPropsWithoutRef<'button'>, 'className'> &
  VariantProps<typeof button>;

export const Button: React.FC<Props> = ({
  children,
  leftIcon: LeftIcon,
  disabled,
  debouncedIsLoading: isLoading = false,
  color = 'black',
  size = 'md',
  ...props
}) => {
  const [debouncedIsLoading] = useDebouncedValue(isLoading, 500);

  return (
    <button
      disabled={isLoading || disabled}
      {...props}
      className={button({ color, size })}
    >
      {debouncedIsLoading && (
        <Loader2Icon
          size={iconSize[size]}
          className="animate-spin"
          strokeWidth={3}
        />
      )}
      {LeftIcon && !debouncedIsLoading && <LeftIcon size={iconSize[size]} />}
      {children}
    </button>
  );
};
