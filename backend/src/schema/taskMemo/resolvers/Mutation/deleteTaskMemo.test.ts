import { db } from "../../../../db";
import { executor, gql } from "../../../../test/graphql";
import { TestHelpers } from "../../../../test/helpers";
import { Mutation, MutationdeleteTaskMemoArgs } from "../../../types.generated";

const validateVariables = (args: MutationdeleteTaskMemoArgs) => args;

describe("タスクメモの削除", () => {
  it("自分のタスクメモを削除できる", async () => {
    const user = await TestHelpers.createUser();
    const task = await TestHelpers.createTask({ userId: user.id });
    const taskMemo = await db.taskMemo.create({
      data: { content: "めもめもめも", taskId: task.id, authorId: user.id },
    });

    await executor<Mutation>({
      document: gql(`
        mutation($input: DeleteTaskMemoInput!) {
          deleteTaskMemo(input: $input) {
            taskMemo { id }
          }
        }
      `),
      variables: validateVariables({ input: { taskMemoId: taskMemo.id } }),
      context: { db, loggedInUserId: user.id },
    });

    const taskMemos = await db.taskMemo.findMany({
      where: { taskId: task.id },
    });
    expect(taskMemos.length).toBe(0);
  });

  it("他人のタスクメモは削除できない", async () => {
    const user = await TestHelpers.createUser();
    const otherUser = await TestHelpers.createUser();
    const otherUserTask = await TestHelpers.createTask({
      userId: otherUser.id,
    });
    const otherUserTaskMemo = await db.taskMemo.create({
      data: {
        content: "other",
        taskId: otherUserTask.id,
        authorId: otherUser.id,
      },
    });

    await executor<Mutation>({
      document: gql(`
        mutation($input: DeleteTaskMemoInput!) {
          deleteTaskMemo(input: $input) {
            taskMemo { id }
          }
        }
      `),
      variables: validateVariables({
        input: { taskMemoId: otherUserTaskMemo.id },
      }),
      context: { db, loggedInUserId: user.id },
    });

    const taskMemos = await db.taskMemo.findMany({
      where: { taskId: otherUserTask.id },
    });
    expect(taskMemos.length).toBe(1);
  });
});
