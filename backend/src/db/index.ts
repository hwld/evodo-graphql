import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { db: PrismaClient };

export const db =
  globalForPrisma.db ||
  new PrismaClient(
    process.env.NODE_ENV === "development"
      ? {
          log: [
            // { emit: "stdout", level: "query" },
            // { emit: "stdout", level: "info" },
          ],
        }
      : undefined,
  );

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.db = db;
}
