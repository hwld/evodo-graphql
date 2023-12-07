import { db } from "../../../../db";
import { executor, gql } from "../../../../test/graphql";
import { TestHelpers } from "../../../../test/helpers";
import { MutationtoggleTaskDoneArgs } from "../../../types.generated";

const validateVariables = (args: MutationtoggleTaskDoneArgs) => args;

describe("タスク完了状態の更新", () => {
  it("自分のタスクの完了状態を変更できる", async () => {
    const user = await TestHelpers.createUser();
    const oldTaskDone = false;
    const newTaskDone = !oldTaskDone;
    const task = await TestHelpers.createTask({
      userId: user.id,
      done: oldTaskDone,
    });

    await executor({
      document: gql(`
        mutation($input: ToggleTaskDoneInput!) {
          toggleTaskDone(input: $input) {
            task { id }
          }
        }
      `),
      variables: validateVariables({
        input: { id: task.id, done: newTaskDone },
      }),
      context: { db, loggedInUserId: user.id },
    });

    const updatedTask = await db.task.findUnique({ where: { id: task.id } });
    expect(updatedTask?.done).toBe(newTaskDone);
  });

  it("他人のタスクの完了状態は変更できない", async () => {
    const user = await TestHelpers.createUser();
    const oldTaskDone = false;
    const newTaskDone = !oldTaskDone;
    const otherUserTask = await TestHelpers.createTask({
      userId: (await TestHelpers.createUser()).id,
      done: oldTaskDone,
    });

    await executor({
      document: gql(`
        mutation($input: ToggleTaskDoneInput!) {
          toggleTaskDone(input: $input) {
            task { id }
          }
        }
      `),
      variables: validateVariables({
        input: { id: otherUserTask.id, done: newTaskDone },
      }),
      context: { db, loggedInUserId: user.id },
    });

    const task = await db.task.findUnique({ where: { id: otherUserTask.id } });
    expect(task?.done).toBe(oldTaskDone);
  });
});
