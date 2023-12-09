import { TypedDocumentNode } from "@apollo/client";
import { Kind } from "graphql";
import { SyntheticEvent } from "react";

export const stopPropagation = (e: SyntheticEvent) => {
  e.stopPropagation();
};

export const noop = () => {};

export const isSameQueryName = <T, K>({
  document,
  queryName,
}: {
  document: TypedDocumentNode<T, K>;
  queryName: string | undefined;
}) => {
  const node = document.definitions[0];
  if (node.kind === Kind.OPERATION_DEFINITION) {
    if (queryName && queryName === node.name?.value) {
      return true;
    }
  }
  return false;
};
