import { Prisma } from '@prisma/client';
import { Task } from '../types.generated';
import { FindManyArgs } from '../../db/types';
import { db } from '../../db';

const taskArgs = {} satisfies Prisma.TaskDefaultArgs;

export const convertTask = (
  raw: Prisma.TaskGetPayload<typeof taskArgs>,
): Task => {
  return {
    id: raw.id,
    title: raw.title,
    detail: raw.detail,
    done: raw.done,
    createdAt: raw.createdAt.toLocaleString(),
    updatedAt: raw.updatedAt.toLocaleString(),
  };
};

type FindManyTasksArgs = FindManyArgs<'task'>;

export const findManyTasks = async (
  args: FindManyTasksArgs,
): Promise<Task[]> => {
  const raws = await db.task.findMany({ ...args });

  const tasks = raws.map(convertTask);
  return tasks;
};
