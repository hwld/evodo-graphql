import { db } from "../db";

const truncateAllTables = async () => {
  const tableNames = await db.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tableNames
    .map(({ tablename }) => tablename)
    .map((name) => `"public"."${name}"`)
    .join(", ");

  await db.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
};

beforeEach(async () => {
  try {
    await truncateAllTables();
  } catch (error) {
    console.log({ error });
  }
});
