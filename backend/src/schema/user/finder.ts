import { Prisma, PrismaClient } from "@prisma/client";
import { User } from "../types.generated";
import { FindFirstArgs } from "../../db/types";

const userArgs = {} satisfies Prisma.UserDefaultArgs;

export const convertUser = (
  raw: Prisma.UserGetPayload<typeof userArgs>,
): User => {
  return {
    id: raw.id,
    name: raw.name,
    avatarUrl: raw.avatarUrl,
    profile: raw.profile,
  };
};

type FindFirstUserArgs = FindFirstArgs<"user", { db: PrismaClient }>;
export const findFirstUser = async ({
  db,
  ...args
}: FindFirstUserArgs): Promise<User | undefined> => {
  const raw = await db.user.findFirst({ ...args });

  if (!raw) {
    return undefined;
  }

  const user = convertUser(raw);
  return user;
};
