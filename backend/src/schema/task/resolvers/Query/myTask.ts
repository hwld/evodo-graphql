import { GraphQLError } from "graphql";
import type { QueryResolvers } from "./../../../types.generated";
export const myTask: NonNullable<QueryResolvers["myTask"]> = async (
  _parent,
  { taskId },
  { loggedInUserId, db },
) => {
  if (!loggedInUserId) {
    throw new GraphQLError("forbidden");
  }

  const task = await db.task.findUnique({
    where: { id: taskId, userId: loggedInUserId },
  });

  if (!task) {
    throw new GraphQLError("not found");
  }

  return task;
};
