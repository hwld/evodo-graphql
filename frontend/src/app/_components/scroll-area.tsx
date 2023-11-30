import * as RadixScrollArea from '@radix-ui/react-scroll-area';
import { forwardRef } from 'react';

type Props = RadixScrollArea.ScrollAreaProps;

export const ScrollArea = forwardRef<HTMLDivElement, Props>(function ScrollArea(
  { children, ...props },
  ref,
) {
  return (
    <RadixScrollArea.Root {...props} ref={ref}>
      <RadixScrollArea.Viewport className="h-full w-full" asChild>
        {children}
      </RadixScrollArea.Viewport>
      <RadixScrollArea.Scrollbar
        className="data-[state=visible]:animate-showScrollbar data-[state=hidden]:animate-hideScrollbar flex h-full w-[13px] touch-none select-none bg-transparent p-[3px] hover:bg-neutral-200"
        orientation="vertical"
      >
        <RadixScrollArea.Thumb className="relative grow rounded-full bg-neutral-400 transition-colors hover:bg-neutral-500" />
      </RadixScrollArea.Scrollbar>
      <RadixScrollArea.Corner />
    </RadixScrollArea.Root>
  );
});
