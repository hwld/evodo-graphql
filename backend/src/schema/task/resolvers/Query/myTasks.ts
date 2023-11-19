import { GraphQLError } from "graphql";
import { findManyTasks } from "../../finder";
import type { QueryResolvers } from "./../../../types.generated";
export const myTasks: NonNullable<QueryResolvers['myTasks']> = async (
  _parent,
  _arg,
  { loggedInUserId }
) => {
  if (!loggedInUserId) {
    throw new GraphQLError("forbidden");
  }

  const tasks = await findManyTasks({
    where: { userId: loggedInUserId },
    orderBy: { createdAt: "asc" },
  });

  return tasks;
};
