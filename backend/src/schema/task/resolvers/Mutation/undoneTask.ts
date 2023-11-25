import { GraphQLError } from 'graphql';
import { convertTask } from '../../finder';
import type { MutationResolvers } from './../../../types.generated';
export const undoneTask: NonNullable<MutationResolvers['undoneTask']> = async (
  _parent,
  { id },
  { loggedInUserId, db },
) => {
  if (!loggedInUserId) {
    throw new GraphQLError('forbidden');
  }

  const updated = await db.task.update({
    where: { id, userId: loggedInUserId },
    data: { done: false },
  });

  const task = convertTask(updated);
  return { task };
};
