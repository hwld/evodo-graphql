import { Task, User } from '@prisma/client';
import { db } from '../db';

export const TestHelpers = {
  createUser: async (): Promise<User> => {
    const user = await db.user.create({
      data: {
        id: Math.random().toString(),
        name: '',
        avatarUrl: '',
        profile: '',
      },
    });
    return user;
  },
  createTask: async ({ userId }: { userId: string }): Promise<Task> => {
    const task = await db.task.create({
      data: { title: 'title', detail: 'detail', userId },
    });

    return task;
  },
};
