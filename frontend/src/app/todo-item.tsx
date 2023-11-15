import { FragmentType, graphql, useFragment } from "@/gql";

const TodoItemFragment = graphql(`
  fragment TodoItemFragment on Task {
    id
    title
    detail
    done
    createdAt
    updatedAt
  }
`);

type Props = { todo: FragmentType<typeof TodoItemFragment> };

export const TodoItem: React.FC<Props> = ({ todo: _todo }) => {
  const todo = useFragment(TodoItemFragment, _todo);
  return (
    <div>
      <div>{todo.title}</div>
    </div>
  );
};
