import { YogaInitialContext } from "graphql-yoga";
import { getTokenFromRequest } from "../lib/utils";
import { db } from "../db";
import { firebaseAuth } from "../services/firebase";
import { DecodedIdToken } from "firebase-admin/auth";
import type { PrismaClient } from "@prisma/client";

export type CustomContext = {
  loggedInUserId: string | undefined;
  firebaseToken: DecodedIdToken | undefined;
  db: PrismaClient;
};
export type Context = YogaInitialContext & CustomContext;

export const yogaContext = async (
  ctx: YogaInitialContext,
): Promise<Context> => {
  const token = getTokenFromRequest(ctx.request);
  if (token === null) {
    return { ...ctx, loggedInUserId: undefined, firebaseToken: undefined, db };
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
    db,
  };
};
