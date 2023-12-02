import * as RadixTooltip from '@radix-ui/react-tooltip';
import { ReactNode } from 'react';

type Props = { children: ReactNode; label: string };
export const Tooltip: React.FC<Props> = ({ children, label }) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side="top"
            align="center"
            className="data-[state=delayed-open]:animate-tooltipEnter data-[state=instant-open]:animate-tooltipEnter data-[state=closed]:animate-tooltipExit rounded bg-neutral-700 px-2 py-1 text-sm text-neutral-100"
          >
            {label}
            <RadixTooltip.Arrow className="fill-neutral-700" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
