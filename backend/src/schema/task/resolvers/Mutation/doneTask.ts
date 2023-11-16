import { db } from "../../../../db";
import { convertTask } from "../../finder";
import type { MutationResolvers } from "./../../../types.generated";
export const doneTask: NonNullable<MutationResolvers['doneTask']> = async (
  _parent,
  { id },
  _ctx
) => {
  const updated = await db.task.update({ where: { id }, data: { done: true } });

  const task = convertTask(updated);
  return task;
};
