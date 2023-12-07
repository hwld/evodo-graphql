import { GraphQLError } from "graphql";
import type { MutationResolvers } from "../../../types.generated";

export const initializeSignupIfNew: NonNullable<
  MutationResolvers["initializeSignupIfNew"]
> = async (_parent, { input }, { db, firebaseUserId }) => {
  const userId = firebaseUserId;
  if (!userId) {
    throw new GraphQLError("forbidden");
  }

  const foundUser = await db.user.findUnique({ where: { id: userId } });
  if (foundUser) {
    return { isNewUser: false };
  }

  // 新規登録前ユーザーを保存する
  // 新規登録のmutation時に、draftUserが存在するかを確認して、存在すれば新規登録させる
  await db.draftUser.upsert({
    where: { id: userId },
    create: {
      id: userId,
      name: input.name ?? "",
      avatarUrl: input.avatarUrl ?? "",
    },
    update: {},
  });

  return { isNewUser: true };
};
