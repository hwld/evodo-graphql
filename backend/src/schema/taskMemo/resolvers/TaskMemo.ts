import { GraphQLError } from "graphql";
import type { TaskMemoResolvers } from "./../../types.generated";
export const TaskMemo: TaskMemoResolvers = {
  author: async (memo, _, { db }) => {
    const author = await db.taskMemo
      .findUnique({ where: { id: memo.id } })
      .author();

    if (!author) {
      throw new GraphQLError("not found");
    }

    return author;
  },
  task: async (memo, _, { db }) => {
    const task = await db.task.findUnique({ where: { id: memo.taskId } });

    if (!task) {
      throw new GraphQLError("not found");
    }

    return task;
  },
};
