import { TestHelpers } from "../../../../test/helpers";
import { executor, gql } from "../../../../test/graphql";
import { db } from "../../../../db";

describe("タスクの作成", () => {
  it("タスクを作成できる", async () => {
    const user = await TestHelpers.createUser();

    await executor({
      document: gql(`mutation {
        createTask(input: {title: "title"}) {
          task { id }
        }
      }`),
      context: { db, loggedInUserId: user.id, firebaseToken: undefined },
    });
    const tasks = await db.task.findMany({ where: { userId: user.id } });

    expect(tasks.length).toBe(1);
  });
});
