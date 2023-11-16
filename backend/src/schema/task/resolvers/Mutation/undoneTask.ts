import { db } from "../../../../db";
import { convertTask } from "../../finder";
import type { MutationResolvers } from "./../../../types.generated";
export const undoneTask: NonNullable<MutationResolvers['undoneTask']> = async (
  _parent,
  { id },
  _ctx
) => {
  const updated = await db.task.update({
    where: { id },
    data: { done: false },
  });

  const task = convertTask(updated);
  return task;
};
