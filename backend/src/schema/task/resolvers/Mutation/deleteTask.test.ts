import { db } from "../../../../db";
import { assertSingleValue, executor, gql } from "../../../../test/graphql";
import { TestHelpers } from "../../../../test/helpers";
import { MutationdeleteTaskArgs } from "../../../types.generated";

const validateVariables = (args: MutationdeleteTaskArgs) => args;

describe("タスクの削除", () => {
  it("自分のタスクを削除できる", async () => {
    const user = await TestHelpers.createUser();
    const task = await TestHelpers.createTask({ userId: user.id });

    await executor({
      document: gql(`
        mutation($id: ID!) {
          deleteTask(id: $id) {
            task { id }
          }
        }
      `),
      variables: validateVariables({ id: task.id }),
      context: { db, loggedInUserId: user.id },
    });

    const deletedTask = await db.task.findUnique({
      where: { id: task.id, userId: user.id },
    });
    expect(deletedTask).toBeNull();
  });

  it("他人のタスクを削除できない", async () => {
    const loggedInUser = await TestHelpers.createUser();
    const otherUser = await TestHelpers.createUser();
    const otherUserTask = await TestHelpers.createTask({
      userId: otherUser.id,
    });

    const result = await executor({
      document: gql(`
        mutation($id: ID!) {
          deleteTask(id: $id) {
            task { id }
          }
        }
      `),
      variables: validateVariables({ id: otherUserTask.id }),
      context: { db, loggedInUserId: loggedInUser.id },
    });
    assertSingleValue(result);

    const task = await db.task.findUnique({ where: { id: otherUserTask.id } });
    expect(result.errors?.length).toBe(1);
    expect(task).not.toBeNull();
  });
});
