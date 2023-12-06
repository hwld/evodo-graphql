import { firebaseAuth } from "../../../../services/firebase";
import type { MutationResolvers } from "../../../types.generated";
export const signup: NonNullable<MutationResolvers["signup"]> = async (
  _parent,
  { input },
  { db },
) => {
  const decoded = await firebaseAuth.verifyIdToken(input.firebaseToken);
  const userId = decoded.sub;

  const user = await db.$transaction(async (tx) => {
    const foundUser = await tx.user.findUnique({ where: { id: userId } });
    if (foundUser) {
      return foundUser;
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
