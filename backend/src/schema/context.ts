import { YogaInitialContext } from 'graphql-yoga';
import { getTokenFromRequest } from '../lib/utils';
import { firebaseAuth } from '../lib/firebase';
import { DecodedIdToken } from 'firebase-admin/auth';
import { db } from '../db';

export type Context = YogaInitialContext & {
  loggedInUserId: string | undefined;
} & { firebaseToken: DecodedIdToken | undefined };

export const yogaContext = async (
  ctx: YogaInitialContext,
): Promise<Context> => {
  const token = getTokenFromRequest(ctx.request);
  if (token === null) {
    return { ...ctx, loggedInUserId: undefined, firebaseToken: undefined };
  }

  const decodedToken = await firebaseAuth.verifyIdToken(token);
  // トークンがあってもユーザーが登録されていない可能性があるので、Userが存在するかを確認する
  const foundUser = await db.user.findUnique({
    where: { id: decodedToken.sub },
  });

  return {
    ...ctx,
    loggedInUserId: foundUser?.id,
    firebaseToken: decodedToken,
  };
};
