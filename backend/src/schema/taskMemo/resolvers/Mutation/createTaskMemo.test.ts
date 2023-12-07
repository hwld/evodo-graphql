import { db } from "../../../../db";
import { assertSingleValue, executor, gql } from "../../../../test/graphql";
import { TestHelpers } from "../../../../test/helpers";
import { MutationcreateTaskMemoArgs } from "../../../types.generated";

const validateVariables = (args: MutationcreateTaskMemoArgs) => args;

describe("タスクメモの作成", () => {
  it("自分のタスクにメモを作成できる", async () => {
    const user = await TestHelpers.createUser();
    const task = await TestHelpers.createTask({ userId: user.id });
    const memo = "めもめもめも";

    await executor({
      document: gql(`
        mutation($input: CreateTaskMemoInput!) {
          createTaskMemo(input: $input) {
            taskMemo { id }
          }
        }
      `),
      variables: validateVariables({
        input: { taskId: task.id, content: memo },
      }),
      context: { db, loggedInUserId: user.id },
    });

    const taskMemos = await db.taskMemo.findMany({
      where: { taskId: task.id },
    });
    expect(taskMemos.length).toBe(1);
    expect(taskMemos[0].content).toBe(memo);
  });

  it("他人のタスクにメモは作成できない", async () => {
    const user = await TestHelpers.createUser();
    const otherUserTask = await TestHelpers.createTask({
      userId: (await TestHelpers.createUser()).id,
    });

    const result = await executor({
      document: gql(`
        mutation($input: CreateTaskMemoInput!) {
          createTaskMemo(input: $input) {
            taskMemo { id }
          }
        }
      `),
      variables: validateVariables({
        input: { taskId: otherUserTask.id, content: "許可されていないメモ" },
      }),
      context: { db, loggedInUserId: user.id },
    });
    assertSingleValue(result);

    expect(result.errors?.length).toBe(1);
  });
});
