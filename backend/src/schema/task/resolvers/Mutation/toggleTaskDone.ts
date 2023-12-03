import { GraphQLError } from 'graphql';
import type { MutationResolvers } from './../../../types.generated';
import { convertTask } from '../../finder';
export const toggleTaskDone: NonNullable<
  MutationResolvers['toggleTaskDone']
> = async (_parent, { input }, { loggedInUserId, db }) => {
  if (!loggedInUserId) {
    throw new GraphQLError('forbidden');
  }

  const updated = await db.task.update({
    where: { id: input.id, userId: loggedInUserId },
    data: { done: input.done },
  });

  const task = convertTask(updated);
  return { task };
};
