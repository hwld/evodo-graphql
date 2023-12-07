import { GraphQLError } from "graphql";
import type { MutationResolvers } from "./../../../types.generated";
export const createTaskMemo: NonNullable<
  MutationResolvers["createTaskMemo"]
> = async (_parent, { input }, { db, loggedInUserId }) => {
  if (!loggedInUserId) {
    throw new GraphQLError("forbidden");
  }

  const task = await db.task.findUnique({ where: { id: input.taskId } });
  if (loggedInUserId !== task?.userId) {
    throw new GraphQLError("forbidden");
  }

  const taskMemo = await db.taskMemo.create({
    data: {
      content: input.content,
      taskId: input.taskId,
      authorId: loggedInUserId,
    },
  });

  return { taskMemo };
};
