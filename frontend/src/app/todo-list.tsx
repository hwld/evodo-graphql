"use client";

import { graphql } from "@/gql";
import { useQuery } from "urql";
import { TodoItem } from "./todo-item";

const TodoListQuery = graphql(`
  query TodoListQuery {
    tsaks {
      id
      ...TodoItemFragment
    }
  }
`);

export const TodoList: React.FC = () => {
  const [{ data, fetching, error }] = useQuery({ query: TodoListQuery });

  if (fetching) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>error</div>;
  }

  return (
    <div>
      {data?.tsaks.map((t) => {
        return <TodoItem todo={t} key={t.id} />;
      })}
    </div>
  );
};
