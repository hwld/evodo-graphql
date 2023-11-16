import { db } from "../../../../db";
import { convertTask } from "../../finder";
import type { MutationResolvers } from "./../../../types.generated";
export const deleteTask: NonNullable<MutationResolvers['deleteTask']> = async (
  _parent,
  _arg,
  _ctx
) => {
  const deleted = await db.task.delete({ where: { id: _arg.id } });
  const task = convertTask(deleted);

  return task;
};
