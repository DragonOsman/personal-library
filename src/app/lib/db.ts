import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });

function createPrisma() {
  return new PrismaClient({ adapter });
}

export type AppPrismaClient = ReturnType<typeof createPrisma>;

const globalForPrisma = globalThis as unknown as {
  prisma: AppPrismaClient | undefined
};

export const prisma: AppPrismaClient = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
