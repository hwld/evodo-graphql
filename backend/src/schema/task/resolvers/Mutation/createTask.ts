import { GraphQLError } from 'graphql';
import { db } from '../../../../db';
import { convertTask } from '../../finder';
import type { MutationResolvers } from './../../../types.generated';

export const createTask: NonNullable<MutationResolvers['createTask']> = async (
  _parent,
  _arg,
  { loggedInUserId },
) => {
  if (!loggedInUserId) {
    throw new GraphQLError('forbidden');
  }

  const raw = await db.task.create({
    data: { title: _arg.input.title, detail: '', userId: loggedInUserId },
  });

  const task = convertTask(raw);
  return { task };
};
