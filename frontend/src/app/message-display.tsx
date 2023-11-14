"use client";
import { graphql } from "@/gql";
import { useQuery } from "urql";

const MessageDocument = graphql(`
  query MessageQuery {
    message
  }
`);

export const MessageDisplay: React.FC = () => {
  const [result] = useQuery({ query: MessageDocument });
  return <div>{result.data?.message}</div>;
};
