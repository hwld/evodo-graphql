import { db } from "../../../../db";
import { firebaseAuth } from "../../../../lib/firebase";
import type { MutationResolvers } from "./../../../types.generated";
export const signUp: NonNullable<MutationResolvers["signUp"]> = async (
  _parent,
  { input },
  _ctx
) => {
  const decoded = await firebaseAuth.verifyIdToken(input.firebaseToken);
  const userId = decoded.sub;

  const foundUser = await db.user.findUnique({ where: { id: userId } });
  if (foundUser) {
    return foundUser;
  }

  const newUser = await db.user.create({
    data: {
      id: userId,
      name: input.name ?? "",
      avatarUrl: input.avatarUrl ?? "",
    },
  });

  return newUser;
};
