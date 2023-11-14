import { FragmentType, graphql, useFragment } from "@/gql";

const MessageFragment = graphql(`
  fragment MessageFragment on Message {
    body
  }
`);

type Props = {
  message: FragmentType<typeof MessageFragment>;
};

export const Message: React.FC<Props> = ({ message: _message }) => {
  const message = useFragment(MessageFragment, _message);
  return <div>{message.body}</div>;
};
