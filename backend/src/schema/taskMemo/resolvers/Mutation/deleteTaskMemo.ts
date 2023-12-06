import { GraphQLError } from "graphql";
import type { MutationResolvers } from "./../../../types.generated";
export const deleteTaskMemo: NonNullable<
  MutationResolvers["deleteTaskMemo"]
> = async (_parent, { input }, { db, loggedInUserId }) => {
  if (!loggedInUserId) {
    throw new GraphQLError("forbidden");
  }

  const deletedMemo = await db.taskMemo.delete({
    where: { id: input.taskMemoId, authorId: loggedInUserId },
  });

  return { taskMemo: deletedMemo };
};
