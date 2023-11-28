import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { RefObject, useMemo, useRef } from 'react';

type EditableAtom = {
  editable: boolean;
  inputRef: RefObject<HTMLInputElement> | null;
};

const editableAtom = atom<EditableAtom>({
  editable: false,
  inputRef: null,
});

const enableEditingAtom = atom(null, (get, set) => {
  const atom = editableAtom;
  set(atom, (prev) => ({ ...prev, editable: true }));

  const input = get(atom).inputRef?.current;
  if (input) {
    setTimeout(() => input.focus(), 0);
  }
});

const disableEditingAtom = atom(null, (_get, set) => {
  set(editableAtom, (prev) => ({ ...prev, editable: false }));
});

// 再レンダリングを制御したかったらhookにまとめないで直接使ったほうが良さそう
export const useEditableTaskTitle = () => {
  const { editable, inputRef } = useAtomValue(editableAtom);
  const enableEditing = useSetAtom(enableEditingAtom);
  const disableEditing = useSetAtom(disableEditingAtom);

  // refをjotaiで管理する
  const _inputRef = useRef<HTMLInputElement>(null);
  const setRefAtom = useMemo(() => {
    const _setRefAtom = atom(null, (_, set, arg: EditableAtom['inputRef']) =>
      set(editableAtom, (s) => ({ ...s, inputRef: arg })),
    );
    _setRefAtom.onMount = (set) => {
      set(_inputRef);
    };

    return _setRefAtom;
  }, []);
  useAtom(setRefAtom);

  return {
    inputRef,
    editable,
    enableEditing,
    disableEditing,
  };
};
