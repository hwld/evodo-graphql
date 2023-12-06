import { GraphQLError } from "graphql";
import type { MutationResolvers } from "./../../../types.generated";
export const toggleTaskDone: NonNullable<
  MutationResolvers["toggleTaskDone"]
> = async (_parent, { input }, { loggedInUserId, db }) => {
  if (!loggedInUserId) {
    throw new GraphQLError("forbidden");
  }

  const task = await db.task.update({
    where: { id: input.id, userId: loggedInUserId },
    data: { done: input.done },
  });

  return { task };
};
