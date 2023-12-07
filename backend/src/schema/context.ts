import { YogaInitialContext } from "graphql-yoga";
import { getTokenFromRequest } from "../lib/utils";
import { db } from "../db";
import { firebaseAuth } from "../services/firebase";
import type { PrismaClient } from "@prisma/client";

export type CustomContext = {
  loggedInUserId: string | undefined;
  /**
   * 受け取った認証情報に存在するfirebaseが管理しているユーザーのID
   * @description
   * GraphQLバックエンドではユーザーの情報だけを管理していて、
   * セッションの管理はクライアントとfirebaseが直接通信して行っている。
   * このフィールドは、ログインしているユーザーのidではなく、firebaseのセッションにあるユーザーのidを表す。
   * ログインしているユーザーのIDは、`loggedInUserId`に入っている
   */
  firebaseUserId?: string;
  db: PrismaClient;
};
export type Context = YogaInitialContext & CustomContext;

export const yogaContext = async (
  ctx: YogaInitialContext,
): Promise<Context> => {
  const token = getTokenFromRequest(ctx.request);
  if (token === null) {
    return { ...ctx, loggedInUserId: undefined, db };
  }

  const decodedToken = await firebaseAuth.verifyIdToken(token);
  const firebaseUserId = decodedToken.sub;
  // トークンがあってもユーザーが登録されていない可能性があるので、Userが存在するかを確認する
  const foundUser = await db.user.findUnique({
    where: { id: firebaseUserId },
  });

  return {
    ...ctx,
    loggedInUserId: foundUser?.id,
    firebaseUserId,
    db,
  };
};
