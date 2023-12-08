import { GraphQLError } from "graphql";
import type { TaskResolvers } from "./../../types.generated";
export const Task: TaskResolvers = {
  author: async (task, _, { db }) => {
    const user = await db.task.findUnique({ where: { id: task.id } }).user();

    if (!user) {
      throw new GraphQLError("not found");
    }

    return user;
  },
  memos: async (task, { first, after }, { db }) => {
    const memos = await db.task.findUnique({ where: { id: task.id } }).memos({
      take: first + 1,
      orderBy: { createdAt: "asc" },
      ...(after && { cursor: { id: after } }),
    });

    if (!memos) {
      throw new GraphQLError("not found");
    }

    const hasNextPage = memos.length === first + 1;
    const returneMemos = hasNextPage ? memos.slice(0, -1) : memos;
    const endCursor = hasNextPage ? memos.at(-1)?.id : undefined;

    return {
      edges: returneMemos.map((memo) => ({ node: memo, cursor: memo.id })),
      pageInfo: {
        hasNextPage,
        endCursor,
      },
    };
  },
};
