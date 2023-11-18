import { YogaInitialContext } from "graphql-yoga";
import { getTokenFromRequest } from "../lib/utils";
import { firebaseAuth } from "../lib/firebase";

export type Context = YogaInitialContext & {
  loggedInUserId: string | undefined;
};

export const yogaContext = async (
  ctx: YogaInitialContext
): Promise<Context> => {
  const token = getTokenFromRequest(ctx.request);
  if (token === null) {
    return { ...ctx, loggedInUserId: undefined };
  }

  const decodedToken = await firebaseAuth.verifyIdToken(token);
  return { ...ctx, loggedInUserId: decodedToken.sub };
};
