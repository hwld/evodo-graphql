import { RefObject, useEffect } from "react";

/**
 * キー入力、レンダリング時にフォーカスを当てる
 */
export const useTaskInputEffect = (ref: RefObject<HTMLInputElement>) => {
  useEffect(() => {
    const focusInput = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && ref.current) {
        ref.current.focus();
      }
    };

    window.addEventListener("keydown", focusInput);
    return () => window.removeEventListener("keydown", focusInput);
  }, [ref]);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [ref]);
};
