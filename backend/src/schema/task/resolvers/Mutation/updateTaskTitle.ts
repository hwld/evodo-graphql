import { db } from "../../../../db";
import { convertTask } from "../../finder";
import type { MutationResolvers } from "./../../../types.generated";

export const updateTaskTitle: NonNullable<MutationResolvers['updateTaskTitle']> = async (_parent, input, _ctx) => {
  const updated = await db.task.update({
    where: { id: input.id },
    data: { title: input.title },
  });

  const task = convertTask(updated);
  return task;
};
