'use client';

import { graphql } from '@/gql';
import { CommandIcon } from 'lucide-react';
import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useMutation } from 'urql';

type Props = {};

const CreateTask = graphql(`
  mutation CreateTaskMutation($input: CreateTaskInput!) {
    createTask(input: $input) {
      task {
        id
      }
    }
  }
`);

export const TaskInput: React.FC<Props> = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [{ fetching }, createTaskMutation] = useMutation(CreateTask);

  const handleChangeTaskTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
  };

  const handleCreateTask = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (fetching || taskTitle === '') {
      return;
    }

    const result = await createTaskMutation({ input: { title: taskTitle } });
    if (result.error) {
      window.alert('タスクが入力できませんでした');
      return;
    }

    setTaskTitle('');
  };

  useEffect(() => {
    const focusInput = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && inputRef.current) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('keydown', focusInput);
    return () => window.removeEventListener('keydown', focusInput);
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div
      className="flex h-[55px] w-[300px] max-w-full shrink-0 items-center rounded-full bg-neutral-900 px-2 text-neutral-100 
        shadow-lg shadow-neutral-900/20 transition-all duration-200 focus-within:w-[700px]
        focus-within:ring-2 focus-within:ring-neutral-500 focus-within:ring-offset-2"
    >
      <form
        className="flex h-full w-full items-center"
        onSubmit={handleCreateTask}
      >
        <input
          ref={inputRef}
          className="w-full bg-transparent px-3 py-3 placeholder:text-neutral-400 focus-visible:outline-none"
          placeholder="タスクを入力してください..."
          onChange={handleChangeTaskTitle}
          value={taskTitle}
        />
      </form>
      <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-neutral-600 text-neutral-200">
        <CommandIcon size={15} />
        <p className="text-sm">K</p>
      </div>
    </div>
  );
};
