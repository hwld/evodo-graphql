import { setTimeout } from "timers/promises";
import { db } from "../../../../db";
import { convertTask } from "../../finder";
import type { MutationResolvers } from "./../../../types.generated";

export const createTask: NonNullable<MutationResolvers['createTask']> = async (
  _parent,
  _arg,
  _ctx
) => {
  const raw = await db.task.create({
    data: { title: _arg.input.title, detail: "" },
  });

  const task = convertTask(raw);
  return task;
};
