import { cx } from 'cva';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { InputBase } from './input-base';

type Props = {
  label: string;
  id: string;
  error?: string;
} & ComponentPropsWithoutRef<'textarea'>;

export const Textarea: React.FC<Props> = forwardRef<HTMLTextAreaElement, Props>(
  function Textarea({ label, id, error, ...props }, ref) {
    const textareaClass = {
      base: 'min-h-[150px] resize-none rounded border bg-neutral-100 px-3 py-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 placeholder:text-neutral-400 disabled:pointer-events-none disabled:opacity-50 disabled:bg-neutral-200',
      normal: 'focus-visible:ring-neutral-500 border-neutral-300',
      error: 'focus-visible:ring-red-500 border-red-500',
    };

    return (
      <InputBase label={label} id={id} error={error}>
        <textarea
          ref={ref}
          id={id}
          className={cx(
            'mt-2',
            textareaClass.base,
            error ? textareaClass.error : textareaClass.normal,
          )}
          {...props}
        />
      </InputBase>
    );
  },
);
