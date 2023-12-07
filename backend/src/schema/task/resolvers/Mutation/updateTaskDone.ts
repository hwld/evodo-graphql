import { GraphQLError } from "graphql";
import type { MutationResolvers } from "./../../../types.generated";
export const updateTaskDone: NonNullable<
  MutationResolvers["updateTaskDone"]
> = async (_parent, { input }, { db, loggedInUserId }) => {
  if (!loggedInUserId) {
    throw new GraphQLError("forbidden");
  }

  const task = await db.task.update({
    where: { id: input.id, userId: loggedInUserId },
    data: { done: input.done },
  });

  return { task };
};
