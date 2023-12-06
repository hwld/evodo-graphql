import { GraphQLError } from "graphql";
import type { MutationResolvers } from "./../../../types.generated";
export const updateTaskDescription: NonNullable<
  MutationResolvers["updateTaskDescription"]
> = async (_parent, { input }, { loggedInUserId, db }) => {
  if (!loggedInUserId) {
    throw new GraphQLError("forbidden");
  }

  const task = await db.task.update({
    where: { id: input.id, userId: loggedInUserId },
    data: { description: input.description },
  });

  return { task };
};
