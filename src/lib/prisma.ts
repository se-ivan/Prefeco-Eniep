import { Prisma, PrismaClient } from "@prisma/client";

function withNotDeleted(args: any) {
  return {
    ...args,
    where: {
      AND: [args?.where ?? {}, { deletedAt: null }],
    },
  };
}

const softDeleteExtension = Prisma.defineExtension((client) =>
  client.$extends({
    query: {
      disciplina: {
        findMany({ args, query }) {
          return query(withNotDeleted(args));
        },
        findFirst({ args, query }) {
          return query(withNotDeleted(args));
        },
        count({ args, query }) {
          return query(withNotDeleted(args));
        },
      },
      categoria: {
        findMany({ args, query }) {
          return query(withNotDeleted(args));
        },
        findFirst({ args, query }) {
          return query(withNotDeleted(args));
        },
        count({ args, query }) {
          return query(withNotDeleted(args));
        },
      },
    },
  })
);

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  }).$extends(softDeleteExtension);
}

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma?: ExtendedPrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
