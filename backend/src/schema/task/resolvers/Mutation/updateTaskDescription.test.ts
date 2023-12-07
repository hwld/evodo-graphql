import { db } from "../../../../db";
import { executor, gql } from "../../../../test/graphql";
import { TestHelpers } from "../../../../test/helpers";
import { MutationupdateTaskDescriptionArgs } from "../../../types.generated";

const validateVariables = (args: MutationupdateTaskDescriptionArgs) => args;

describe("タスクの説明の更新", () => {
  it("自分のタスクの説明を変更できる", async () => {
    const user = await TestHelpers.createUser();
    const oldDescription = "変更前の説明";
    const newDescription = "変更後の説明";
    const task = await TestHelpers.createTask({
      userId: user.id,
      description: oldDescription,
    });

    await executor({
      document: gql(`
        mutation($input: UpdateTaskDescriptionInput!) {
          updateTaskDescription(input: $input) {
            task { id }
          }
        }
      `),
      variables: validateVariables({
        input: {
          id: task.id,
          description: newDescription,
        },
      }),
      context: { db, loggedInUserId: user.id },
    });

    const updatedTask = await db.task.findUnique({ where: { id: task.id } });
    expect(updatedTask?.description).toBe(newDescription);
  });

  it("他人のタスクの説明は変更できない", async () => {
    const user = await TestHelpers.createUser();
    const oldDescription = "変更前の説明";
    const newDescription = "変更後の説明";
    const otherUserTask = await TestHelpers.createTask({
      userId: (await TestHelpers.createUser()).id,
      description: oldDescription,
    });

    await executor({
      document: gql(`
        mutation($input: UpdateTaskDescriptionInput!) {
          updateTaskDescription(input: $input) {
            task { id }
          }
        }
      `),
      variables: validateVariables({
        input: {
          id: otherUserTask.id,
          description: newDescription,
        },
      }),
      context: { db, loggedInUserId: user.id },
    });

    const updatedTask = await db.task.findUnique({
      where: { id: otherUserTask.id },
    });
    expect(updatedTask?.description).toBe(oldDescription);
  });
});
