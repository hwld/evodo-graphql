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
  memos: async (task, _, { db }) => {
    const memos = await db.task
      .findUnique({ where: { id: task.id } })
      .memos({ orderBy: { createdAt: "asc" } });

    if (!memos) {
      throw new GraphQLError("not found");
    }

    return memos;
  },
};
