"use client";
import { graphql } from "@/gql";
import { useQuery } from "urql";
import { Message } from "./message";

const MessageDocument = graphql(`
  query MessageQuery {
    message {
      ...MessageFragment
    }
  }
`);

export const MessageDisplay: React.FC = () => {
  const [result] = useQuery({ query: MessageDocument });

  if (!result.data?.message) {
    return <div></div>;
  }

  return (
    <div>
      <Message message={result.data.message} />
    </div>
  );
};
