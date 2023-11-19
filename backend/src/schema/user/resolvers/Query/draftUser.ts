import { GraphQLEnumType, GraphQLError } from "graphql";
import type { QueryResolvers } from "./../../../types.generated";
import { db } from "../../../../db";
export const draftUser: NonNullable<QueryResolvers['draftUser']> = async (
  _parent,
  _arg,
  _ctx
) => {
  const draftUserId = _ctx.firebaseToken?.sub;
  if (!draftUserId) {
    throw new GraphQLError("not found user");
  }

  const draftUser = await db.draftUser.findUnique({
    where: { id: draftUserId },
  });
  if (!draftUser) {
    throw new GraphQLError("not found user", {});
  }

  return {
    id: draftUser.id,
    name: draftUser.name,
    avatarUrl: draftUser.avatarUrl,
  };
};
