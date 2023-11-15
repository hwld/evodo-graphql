import { findManyTasks } from "../../finder";
import type { QueryResolvers } from "./../../../types.generated";
export const tsaks: NonNullable<QueryResolvers['tsaks']> = async (
  _parent,
  _arg,
  _ctx
) => {
  /* Implement Query.tsaks resolver logic here */
  const tasks = await findManyTasks({});
  return tasks;
};
