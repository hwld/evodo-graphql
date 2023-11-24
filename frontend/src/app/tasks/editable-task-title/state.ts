import { atom, useAtomValue, useSetAtom } from 'jotai';

type EditableAtom = { inputEl: HTMLInputElement | null; editable: boolean };

const editableAtom = atom<EditableAtom>({
  inputEl: null,
  editable: false,
});

const setInputElAtom = atom(null, (_, set, update: EditableAtom['inputEl']) => {
  set(editableAtom, (prev) => ({ ...prev, inputEl: update }));
});

const enableEditingAtom = atom(null, (get, set) => {
  const atom = editableAtom;
  set(atom, (prev) => ({ ...prev, editable: true }));

  const input = get(atom).inputEl;
  if (input) {
    setTimeout(() => input.focus(), 0);
  }
});

const disableEditingAtom = atom(null, (_get, set) => {
  set(editableAtom, (prev) => ({ ...prev, editable: false }));
});

// 再レンダリングを制御したかったらhookにまとめないで直接使ったほうが良さそう
export const useEditableTaskTitle = () => {
  const { editable, inputEl } = useAtomValue(editableAtom);
  const setInputEl = useSetAtom(setInputElAtom);
  const enableEditing = useSetAtom(enableEditingAtom);
  const disableEditing = useSetAtom(disableEditingAtom);

  return {
    inputEl,
    setInputEl,
    editable,
    enableEditing,
    disableEditing,
  };
};
