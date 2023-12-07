import { db } from "../../../../db";
import { assertSingleValue, executor, gql } from "../../../../test/graphql";
import { TestHelpers } from "../../../../test/helpers";

describe("ログインユーザーのタスクの取得", () => {
  it("タスクを取得できる", async () => {
    const user = await TestHelpers.createUser();
    await TestHelpers.createTask({ userId: user.id });
    await TestHelpers.createTask({ userId: user.id });

    const result = await executor({
      document: gql(`query { myTasks { title, description }}`),
      context: { loggedInUserId: user.id, db },
    });
    assertSingleValue(result);

    expect(result.data?.myTasks.length).toBe(2);
  });

  it("他のユーザーのタスクは取得できない", async () => {
    const user = await TestHelpers.createUser();
    TestHelpers.createTask({ userId: user.id });

    const result = await executor({
      document: gql(`query { myTasks {title, description} }`),
      context: { loggedInUserId: "dummy", db },
    });
    assertSingleValue(result);

    expect(result.data?.myTasks.length).toBe(0);
  });
});
