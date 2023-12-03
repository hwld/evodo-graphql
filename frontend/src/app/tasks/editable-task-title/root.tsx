import {
  ReactNode,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type EditableTaskTitleContext = {
  editable: boolean;
  inputRef: RefObject<HTMLInputElement> | null;
  enableEditing: () => void;
  disableEditing: () => void;
};

const editableTaskTitleContext = createContext<
  EditableTaskTitleContext | undefined
>(undefined);

export const useEditableTaskTitle = () => {
  const context = useContext(editableTaskTitleContext);
  if (!context) {
    throw new Error("EditableTaskTitle.Rootが使用されていません。");
  }
  return context;
};

export const _Root: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [editable, setEditable] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const enableEditing = useCallback(() => {
    setEditable(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const disableEditing = useCallback(() => {
    setEditable(false);
  }, []);

  return (
    <editableTaskTitleContext.Provider
      value={{ editable, inputRef, enableEditing, disableEditing }}
    >
      {children}
    </editableTaskTitleContext.Provider>
  );
};
