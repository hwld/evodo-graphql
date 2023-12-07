import { GraphQLError } from "graphql";
import type { MutationResolvers } from "../../../types.generated";
export const signup: NonNullable<MutationResolvers["signup"]> = async (
  _parent,
  { input },
  { db, firebaseUserId },
) => {
  const userId = firebaseUserId;
  if (!userId) {
    throw new GraphQLError("forbidden");
  }

  const user = await db.$transaction(async (tx) => {
    const foundUser = await tx.user.findUnique({ where: { id: userId } });
    if (foundUser) {
      return foundUser;
    }

    const draftUser = await tx.draftUser.findUnique({ where: { id: userId } });
    // 新規登録の準備でdraftUserが作られていなければエラーにする
    if (!draftUser) {
      throw new GraphQLError("forbidden");
    }

    const newUser = await tx.user.create({
      data: {
        id: userId,
        name: input.name ?? "",
        avatarUrl: input.avatarUrl ?? "",
        profile: input.profile ?? "",
      },
    });

    await tx.draftUser.delete({ where: { id: userId } });

    return newUser;
  });

  return { user };
};
