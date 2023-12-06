import { GraphQLError } from "graphql";
import type { TaskResolvers } from "./../../types.generated";
export const Task: TaskResolvers = {
  /* Implement Task resolver logic here */
  author: async (task, _, { db }) => {
    const user = await db.task
      .findUnique({ where: { id: task.id.toString() } })
      .user();

    if (!user) {
      throw new GraphQLError("not found");
    }

    return user;
  },
};
