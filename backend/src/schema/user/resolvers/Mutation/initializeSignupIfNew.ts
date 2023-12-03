import { firebaseAuth } from "../../../../services/firebase";
import type { MutationResolvers } from "../../../types.generated";

export const initializeSignupIfNew: NonNullable<
  MutationResolvers["initializeSignupIfNew"]
> = async (_parent, { input }, { db }) => {
  const decoded = await firebaseAuth.verifyIdToken(input.firebaseToken);
  const userId = decoded.sub;

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
