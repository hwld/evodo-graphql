import { GraphQLError } from "graphql";
import { findFirstUser } from "../../finder";
import type { QueryResolvers } from "./../../../types.generated";
export const user: NonNullable<QueryResolvers['user']> = async (
  _parent,
  _arg,
  _ctx
) => {
  const user = await findFirstUser({ where: { id: _arg.id } });
  if (!user) {
    throw new GraphQLError("not found user");
  }

  return user;
};
