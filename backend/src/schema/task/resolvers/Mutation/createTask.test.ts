import { TestHelpers } from "../../../../test/helpers";
import { assertSingleValue, executor, gql } from "../../../../test/graphql";
import { db } from "../../../../db";

describe("タスクの作成", () => {
  it("ログインしていないユーザーはタスクの作成に失敗する", async () => {
    const result = await executor({
      document: gql(`mutation {
        createTask( input: { title: "title" }) {
          task { id }
        }
      }`),
      context: { db, loggedInUserId: undefined },
    });
    assertSingleValue(result);

    const tasks = await db.task.findMany({});
    expect(result.errors?.length).toBe(1);
    expect(tasks.length).toBe(0);
  });

  it("タスクを作成できる", async () => {
    const user = await TestHelpers.createUser();

    await executor({
      document: gql(`mutation {
        createTask(input: {title: "title"}) {
          task { id }
        }
      }`),
      context: { db, loggedInUserId: user.id },
    });

    const tasks = await db.task.findMany({ where: { userId: user.id } });
    expect(tasks.length).toBe(1);
  });
});
