import { GraphQLError } from "graphql";
import type { QueryResolvers } from "./../../../types.generated";
export const user: NonNullable<QueryResolvers["user"]> = async (
  _parent,
  _arg,
  { db },
) => {
  const user = await db.user.findUnique({ where: { id: _arg.id } });
  if (!user) {
    throw new GraphQLError("not found user");
  }

  return user;
};
