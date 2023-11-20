import { GraphQLError } from "graphql";
import { db } from "../../../../db";
import { convertTask } from "../../finder";
import type { MutationResolvers } from "./../../../types.generated";
export const deleteTask: NonNullable<MutationResolvers['deleteTask']> = async (
  _parent,
  _arg,
  { loggedInUserId }
) => {
  if (!loggedInUserId) {
    throw new GraphQLError("forbidden");
  }

  const deleted = await db.task.delete({
    where: { id: _arg.id, userId: loggedInUserId },
  });
  const task = convertTask(deleted);

  return { task };
};
