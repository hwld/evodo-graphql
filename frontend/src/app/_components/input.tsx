import { preventDefaultEnter } from '@/lib/preventDefault';
import { cx } from 'cva';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { InputBase } from './input-base';

type Props = { label: string; id: string; error?: string } & Omit<
  ComponentPropsWithoutRef<'input'>,
  'id'
>;

export const Input: React.FC<Props> = forwardRef<HTMLInputElement, Props>(
  function Input({ label, id, error, onKeyDown, ...props }, ref) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      preventDefaultEnter(e);
      onKeyDown?.(e);
    };

    const inputClass = {
      base: 'rounded border px-3 py-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-neutral-100 placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50',
      normal: 'focus-visible:ring-neutral-500 border-neutral-300',
      error: 'focus-visible:ring-red-500 border-red-500',
    };

    return (
      <InputBase id={id} label={label} error={error}>
        <input
          ref={ref}
          type="text"
          id={id}
          className={cx(
            'mt-2',
            inputClass.base,
            error ? inputClass.error : inputClass.normal,
          )}
          onKeyDown={handleKeyDown}
          {...props}
        />
      </InputBase>
    );
  },
);
