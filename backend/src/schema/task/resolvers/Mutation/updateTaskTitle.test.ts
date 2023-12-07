import { db } from "../../../../db";
import { executor, gql } from "../../../../test/graphql";
import { TestHelpers } from "../../../../test/helpers";
import { MutationupdateTaskTitleArgs } from "../../../types.generated";

const validateVariables = (args: MutationupdateTaskTitleArgs) => args;

describe("タスクタイトルの更新", () => {
  it("自分のタスクのタイトルを変更できる", async () => {
    const user = await TestHelpers.createUser();
    const oldTitle = "変更前のタイトル";
    const newTitle = "変更後のタイトル";
    const task = await TestHelpers.createTask({
      userId: user.id,
      title: oldTitle,
    });

    await executor({
      document: gql(`
        mutation($input: UpdateTaskTitleInput!) {
          updateTaskTitle(input: $input) {
            task { id }
          }
        }
      `),
      variables: validateVariables({ input: { id: task.id, title: newTitle } }),
      context: { db, loggedInUserId: user.id },
    });

    const updatedTask = await db.task.findUnique({ where: { id: task.id } });
    expect(updatedTask?.title).toBe(newTitle);
  });

  it("他人のタスクのタイトルは変更できない", async () => {
    const user = await TestHelpers.createUser();
    const oldTitle = "変更前のタイトル";
    const newTitle = "変更後のタイトル";
    const otherUserTask = await TestHelpers.createTask({
      userId: (await TestHelpers.createUser()).id,
      title: oldTitle,
    });

    await executor({
      document: gql(`
        mutation($input: UpdateTaskTitleInput!) {
          updateTaskTitle(input: $input) {
            task { id }
          }
        }
      `),
      variables: validateVariables({
        input: { id: otherUserTask.id, title: newTitle },
      }),
      context: { db, loggedInUserId: user.id },
    });

    const updatedTask = await db.task.findUnique({
      where: { id: otherUserTask.id },
    });
    expect(updatedTask?.title).toBe(oldTitle);
  });
});
