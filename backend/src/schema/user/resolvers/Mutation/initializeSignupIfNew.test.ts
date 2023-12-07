import { db } from "../../../../db";
import { assertSingleValue, executor, gql } from "../../../../test/graphql";
import { TestHelpers } from "../../../../test/helpers";
import {
  Mutation,
  MutationinitializeSignupIfNewArgs,
} from "../../../types.generated";

const validateVariables = (args: MutationinitializeSignupIfNewArgs) => args;

// GraphQLバックエンドではセッションの管理は行わず、ユーザーの情報のみを管理する。
// セッションの管理はフロントエンドがfirebaseと通信して行うため、登録前のユーザーでも
// firebaseのIDトークンは持っていると仮定している。
describe("新規登録の準備", () => {
  it("認証情報のないユーザーはエラーになる", async () => {
    const result = await executor<Mutation>({
      document: gql(`
        mutation($input: InitializeSignupIfNewInput!) {
          initializeSignupIfNew(input: $input) {
            isNewUser
          }
        }
      `),
      variables: validateVariables({
        input: { name: "newUser", avatarUrl: "" },
      }),
      context: { db, loggedInUserId: undefined, firebaseUserId: undefined },
    });
    assertSingleValue(result);

    expect(result.errors?.length).toBe(1);
  });

  it("未登録のユーザーは新しいユーザーとして扱われる", async () => {
    const result = await executor<Mutation>({
      document: gql(`
        mutation($input: InitializeSignupIfNewInput!) {
          initializeSignupIfNew(input: $input) {
            isNewUser
          }
        }
      `),
      variables: validateVariables({
        input: { name: "newUser", avatarUrl: "" },
      }),
      context: { db, loggedInUserId: undefined, firebaseUserId: "new-user-id" },
    });
    assertSingleValue(result);

    expect(result.data?.initializeSignupIfNew.isNewUser).toBe(true);
  });

  it("登録済みのユーザーは新しいユーザーとして扱われない", async () => {
    const user = await TestHelpers.createUser();

    const result = await executor<Mutation>({
      document: gql(`
        mutation($input: InitializeSignupIfNewInput!) {
          initializeSignupIfNew(input: $input) {
            isNewUser
          }
        }
      `),
      variables: validateVariables({
        input: { name: "new-user", avatarUrl: "" },
      }),
      context: { db, loggedInUserId: undefined, firebaseUserId: user.id },
    });
    assertSingleValue(result);

    expect(result.data?.initializeSignupIfNew.isNewUser).toBe(false);
  });
});
