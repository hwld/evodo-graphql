import { GraphQLError } from "graphql";
import type { QueryResolvers } from "./../../../types.generated";
export const myTasks: NonNullable<QueryResolvers["myTasks"]> = async (
  _parent,
  _arg,
  { loggedInUserId, db },
) => {
  if (!loggedInUserId) {
    throw new GraphQLError("forbidden");
  }

  const tasks = await db.task.findMany({
    where: { userId: loggedInUserId },
    orderBy: { createdAt: "asc" },
  });

  return tasks;
};
