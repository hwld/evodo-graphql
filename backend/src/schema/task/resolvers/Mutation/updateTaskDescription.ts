import { GraphQLError } from "graphql";
import type { MutationResolvers } from "./../../../types.generated";
import { convertTask } from "../../finder";
export const updateTaskDescription: NonNullable<
  MutationResolvers["updateTaskDescription"]
> = async (_parent, { input }, { loggedInUserId, db }) => {
  if (!loggedInUserId) {
    throw new GraphQLError("forbidden");
  }

  const updated = await db.task.update({
    where: { id: input.id, userId: loggedInUserId },
    data: { description: input.description },
  });

  const task = convertTask(updated);
  return { task };
};
