import * as RadixTooltip from "@radix-ui/react-tooltip";

type Props = {
  children: React.ReactNode;
  label: string;
  asChild?: boolean;
};

/**
 *  asChild=false以外の場合、Tooltipに渡すchildrenはComponentPropsWithoutRef<"button">を受け取る必要がある。
 */
export const Tooltip: React.FC<Props> = ({
  children,
  label,
  asChild = true,
}) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild={asChild}>
          {children}
        </RadixTooltip.Trigger>
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
