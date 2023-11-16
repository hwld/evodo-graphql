import { findManyTasks } from "../../finder";
import type { QueryResolvers } from "./../../../types.generated";
export const tasks: NonNullable<QueryResolvers['tasks']> = async (
  _parent,
  _arg,
  _ctx
) => {
  const tasks = await findManyTasks({ orderBy: { createdAt: "asc" } });
  return tasks;
};
