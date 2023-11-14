import type { QueryResolvers } from "./../../../types.generated";
export const message: NonNullable<QueryResolvers["message"]> = async (
  _parent,
  _arg,
  _ctx
) => {
  /* Implement Query.message resolver logic here */
  return "Hello world!";
};
