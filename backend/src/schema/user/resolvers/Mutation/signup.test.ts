import { db } from "../../../../db";
import { assertSingleValue, executor, gql } from "../../../../test/graphql";
import {
  Mutation,
  MutationinitializeSignupIfNewArgs,
  MutationsignupArgs,
} from "../../../types.generated";

const validateInitializeVariables = (args: MutationinitializeSignupIfNewArgs) =>
  args;
const validateVariables = (args: MutationsignupArgs) => args;

describe("新規登録", () => {
  it("新規登録できる", async () => {
    const decodedFirebaseUserId = "new-user-id";
    const newName = "userName";
    const newAvatarUrl = "avatarUrl";
    const newProfile = "profile";
    await executor({
      document: gql(`
        mutation($input: InitializeSignupIfNewInput!) {
          initializeSignupIfNew(input: $input) {
            isNewUser
          }
        }
      `),
      variables: validateInitializeVariables({
        input: { name: "name", avatarUrl: "" },
      }),
      context: {
        db,
        loggedInUserId: undefined,
        firebaseUserId: decodedFirebaseUserId,
      },
    });

    await executor<Mutation>({
      document: gql(`
        mutation ($input: SignupInput!) {
          signup(input: $input) {
            user {
              id
            }
          }
        }
      `),
      variables: validateVariables({
        input: { name: newName, avatarUrl: newAvatarUrl, profile: newProfile },
      }),
      context: {
        db,
        loggedInUserId: undefined,
        firebaseUserId: decodedFirebaseUserId,
      },
    });

    const createdUser = await db.user.findUnique({
      where: { id: decodedFirebaseUserId },
    });
    expect(createdUser?.id).toBe(decodedFirebaseUserId);
    expect(createdUser?.name).toBe(newName);
    expect(createdUser?.profile).toBe(newProfile);
    expect(createdUser?.avatarUrl).toBe(newAvatarUrl);
  });

  it("新規登録の準備を実行しなければ新規登録はできない", async () => {
    const result = await executor<Mutation>({
      document: gql(`
        mutation($input: SignupInput!) {
          signup(input: $input) {
            user { id }
          }
        }
      `),
      variables: validateVariables({
        input: { name: "newUser", avatarUrl: "avatarUrl", profile: "profile" },
      }),
      context: { db, loggedInUserId: undefined, firebaseUserId: "new-user-id" },
    });
    assertSingleValue(result);

    const users = await db.user.findMany();
    expect(result.errors?.length).toBe(1);
    expect(users.length).toBe(0);
  });
});
