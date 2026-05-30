import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
async function main() {
  const accounts = await prisma.account.findMany({
    take: 3,
    select: {
      id: true,
      accountId: true,
      providerId: true,
      userId: true,
      password: true,
    }
  });
  console.log("Sample accounts:", accounts);
}
main().catch(console.error).finally(() => prisma.$disconnect());
