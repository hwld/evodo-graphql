import { GraphQLError } from "graphql";
import { db } from "../../../../db";
import { convertTask } from "../../finder";
import type { MutationResolvers } from "./../../../types.generated";

export const updateTaskTitle: NonNullable<MutationResolvers['updateTaskTitle']> = async (_parent, input, { loggedInUserId }) => {
  if (!loggedInUserId) {
    throw new GraphQLError("forbidden");
  }

  const updated = await db.task.update({
    where: { id: input.id, userId: loggedInUserId },
    data: { title: input.title },
  });

  const task = convertTask(updated);
  return { task };
};
