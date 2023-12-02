import { Prisma, PrismaClient } from '@prisma/client';
import { Task } from '../types.generated';
import { FindManyArgs } from '../../db/types';

const taskArgs = {} satisfies Prisma.TaskDefaultArgs;

export const convertTask = (
  raw: Prisma.TaskGetPayload<typeof taskArgs>,
): Task => {
  return {
    id: raw.id,
    title: raw.title,
    detail: raw.detail,
    done: raw.done,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
};

type FindManyTasksArgs = FindManyArgs<'task', { db: PrismaClient }>;

export const findManyTasks = async ({
  db,
  ...args
}: FindManyTasksArgs): Promise<Task[]> => {
  const raws = await db.task.findMany({ ...args });

  const tasks = raws.map(convertTask);
  return tasks;
};
