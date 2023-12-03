import { arrow, autoUpdate, offset, useFloating } from "@floating-ui/react";
import {
  CSSProperties,
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useRef,
} from "react";

type PopoverContext = {
  isOpen: boolean;
  setReference: (n: HTMLElement | null) => void;
  setFloating: (n: HTMLElement | null) => void;
  arrowRef: RefObject<SVGSVGElement>;
  floatingStyles: CSSProperties;
  context: ReturnType<typeof useFloating>["context"];
};
const popoverContext = createContext<PopoverContext | undefined>(undefined);

export const usePopoverContext = () => {
  const context = useContext(popoverContext);
  if (!context) {
    throw new Error("popoverContext.Providerが存在しません。");
  }

  return context;
};

type Props = {
  isOpen: boolean;
  children: ReactNode;
  placement: NonNullable<Parameters<typeof useFloating>[0]>["placement"];
  offsetOptions?: Parameters<typeof offset>[0];
  arrowOptions?: Omit<Parameters<typeof arrow>[0], "element">;
};

export const _Root: React.FC<Props> = ({
  isOpen,
  children,
  placement,
  offsetOptions = { mainAxis: 18 },
  arrowOptions,
}) => {
  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement,
    middleware: [
      offset(offsetOptions),
      arrow({ ...arrowOptions, element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
  });

  return (
    <popoverContext.Provider
      value={{
        isOpen,
        arrowRef,
        setFloating: refs.setFloating,
        setReference: refs.setReference,
        floatingStyles,
        context,
      }}
    >
      {children}
    </popoverContext.Provider>
  );
};
