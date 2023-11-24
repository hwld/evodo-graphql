import { GraphQLError } from "graphql";
import { db } from "../../../../db";
import { convertTask } from "../../finder";
import type { MutationResolvers } from "./../../../types.generated";
export const doneTask: NonNullable<MutationResolvers["doneTask"]> = async (
  _parent,
  { id },
  { loggedInUserId },
) => {
  if (!loggedInUserId) {
    throw new GraphQLError("forbidden");
  }

  const updated = await db.task.update({
    where: { id, userId: loggedInUserId },
    data: { done: true },
  });

  const task = convertTask(updated);
  return { task };
};
