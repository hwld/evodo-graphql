import { Task, User } from "@prisma/client";
import { db } from "../db";
import { TaskMapper } from "../schema/task/task.mappers";

export const TestHelpers = {
  createUser: async (): Promise<User> => {
    const user = await db.user.create({
      data: {
        id: Math.random().toString(),
        name: "",
        avatarUrl: "",
        profile: "",
      },
    });
    return user;
  },
  createTask: async ({
    userId,
    ...others
  }: { userId: string } & Partial<TaskMapper>): Promise<Task> => {
    const task = await db.task.create({
      data: { title: "title", description: "description", userId, ...others },
    });

    return task;
  },
};
