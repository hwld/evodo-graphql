import { GraphQLError } from "graphql";
import type { MutationResolvers } from "./../../../types.generated";
export const deleteTask: NonNullable<MutationResolvers["deleteTask"]> = async (
  _parent,
  _arg,
  { loggedInUserId, db },
) => {
  if (!loggedInUserId) {
    throw new GraphQLError("forbidden");
  }

  const task = await db.task.delete({
    where: { id: _arg.id, userId: loggedInUserId },
  });

  return { task };
};
