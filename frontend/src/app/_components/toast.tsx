"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import * as RadixToast from "@radix-ui/react-toast";
import { XIcon } from "lucide-react";
import { cx } from "cva";
import { LayoutGroup, motion } from "framer-motion";

type ToastItem = {
  id: string;
  type: "success" | "error";
  title: ReactNode;
  description?: ReactNode;
  duration?: number;
  isOpen: boolean;
};

type ToastParams = Omit<ToastItem, "id" | "isOpen">;

type ToastContextValue = { toast: (params: ToastParams) => void };
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("ToastProviderが必要です。");
  }

  return ctx;
};

type ToastProps = { toast: ToastItem; onClose: (id: string) => void };
const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose(toast.id);
    }
  };

  return (
    <RadixToast.Root
      open={toast.isOpen}
      onOpenChange={handleOpenChange}
      duration={toast.duration}
      asChild
    >
      <motion.div
        layout
        className={cx(
          "group",
          "cursor-pointer",
          "data-[state=closed]:animate-toastSlideRight",
        )}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div
          className={cx(
            "relative my-1 flex h-fit items-center justify-between gap-1 rounded-lg bg-neutral-900 p-3 text-neutral-100 shadow-md",
            // motion.divに渡しても動かないことがあるので、もう一つdivを追加した
            "group-data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
            "group-data-[swipe=cancel]:translate-x-0",
            "group-data-[swipe=cancel]:transition-[transform]",
          )}
        >
          <div className="flex h-full gap-1">
            <div
              className={cx(
                "absolute bottom-2 left-2 top-2 w-[4px] rounded-full",
                toast.type === "success" && "bg-green-600",
                toast.type === "error" && "bg-red-500",
              )}
            />
            <div className="ml-2 flex flex-col gap-1">
              <RadixToast.Title className="text-sm">
                {toast.title}
              </RadixToast.Title>
              <RadixToast.Description className="text-xs text-neutral-300">
                {toast.description}
              </RadixToast.Description>
            </div>
          </div>
          <div>
            <RadixToast.Close className="flex items-center rounded transition-colors hover:bg-neutral-700">
              <XIcon size={20} />
            </RadixToast.Close>
          </div>
        </div>
      </motion.div>
    </RadixToast.Root>
  );
};

type ToastProviderProps = { children: ReactNode };
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const openToast = useCallback((params: ToastParams) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...params, id, isOpen: true }]);
  }, []);

  const closeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isOpen: false } : t)),
    );
  }, []);

  return (
    <ToastContext.Provider value={{ toast: openToast }}>
      <RadixToast.Provider duration={5000} swipeThreshold={100}>
        {children}
        <LayoutGroup>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={closeToast} />
          ))}
        </LayoutGroup>
        <RadixToast.Viewport className="fixed bottom-[70px] right-[10px] z-[100] w-[350px]" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
};
