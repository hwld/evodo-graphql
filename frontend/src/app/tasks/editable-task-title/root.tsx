import {
  MutableRefObject,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type EditableTaskTitle = {
  inputRef: MutableRefObject<HTMLInputElement | null>;
  editable: boolean;
  setEditable: (value: boolean) => void;
  enableEditing: () => void;
};
const editableTaskTitleContext = createContext<EditableTaskTitle | undefined>(
  undefined,
);

export const useEditableTaskTitleContext = () => {
  const context = useContext(editableTaskTitleContext);
  if (context === undefined) {
    throw new Error("Field,Triggerを使用するには、Rootでラップしてください。");
  }

  return context;
};

export const _Root: React.FC<{ children: ReactNode }> = ({ children }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editable, setEditable] = useState(false);

  const enableEditing = useCallback(() => {
    if (!inputRef.current) {
      return;
    }
    setEditable(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  return (
    <editableTaskTitleContext.Provider
      value={{ inputRef, editable, setEditable, enableEditing }}
    >
      {children}
    </editableTaskTitleContext.Provider>
  );
};
