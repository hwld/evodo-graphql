import { Prisma } from '@prisma/client';
import { User } from '../types.generated';
import { FindFirstArgs } from '../../db/types';
import { db } from '../../db';

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

type FindFirstUserArgs = FindFirstArgs<'user'>;
export const findFirstUser = async (
  args: FindFirstUserArgs,
): Promise<User | undefined> => {
  const raw = await db.user.findFirst({ ...args });

  if (!raw) {
    return undefined;
  }

  const user = convertUser(raw);
  return user;
};
