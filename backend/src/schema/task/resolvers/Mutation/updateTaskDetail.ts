import { GraphQLError } from 'graphql';
import type { MutationResolvers } from './../../../types.generated';
import { convertTask } from '../../finder';
export const updateTaskDetail: NonNullable<
  MutationResolvers['updateTaskDetail']
> = async (_parent, { input }, { loggedInUserId, db }) => {
  if (!loggedInUserId) {
    throw new GraphQLError('forbidden');
  }

  const updated = await db.task.update({
    where: { id: input.id, userId: loggedInUserId },
    data: { detail: input.detail },
  });

  const task = convertTask(updated);
  return { task };
};
