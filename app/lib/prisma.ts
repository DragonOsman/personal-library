import { PrismaClient } from "@prisma/client";

const prismaClient = () => {
  return new PrismaClient;
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClient>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;