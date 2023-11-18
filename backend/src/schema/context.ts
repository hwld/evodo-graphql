import { YogaInitialContext } from "graphql-yoga";
import { getTokenFromRequest } from "../lib/utils";
import { firebaseAuth } from "../lib/firebase";

export type Context = YogaInitialContext;

export const yogaContext = async (
  ctx: YogaInitialContext
): Promise<Context> => {
  const token = getTokenFromRequest(ctx.request);
  if (token === null) {
    return { ...ctx };
  }

  const decodedToken = await firebaseAuth.verifyIdToken(token);

  // TODO: ここでsubを使ってログインしてるユーザー情報を取得してctxに詰める
  console.log(decodedToken.sub);
  return { ...ctx };
};
