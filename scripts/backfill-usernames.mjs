import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalizeUsername(input) {
  const base = String(input || "user")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return base || "user";
}

async function main() {
  const usersWithoutUsername = await prisma.user.findMany({
    where: { username: null },
    select: { id: true, email: true },
    orderBy: { createdAt: "asc" },
  });

  if (usersWithoutUsername.length === 0) {
    console.log("No hay usuarios pendientes de backfill.");
    return;
  }

  const existingUsers = await prisma.user.findMany({
    where: { username: { not: null } },
    select: { username: true },
  });

  const taken = new Set(
    existingUsers
      .map((u) => (u.username || "").toLowerCase())
      .filter(Boolean)
  );

  let updated = 0;

  for (const user of usersWithoutUsername) {
    const emailLocalPart = String(user.email || "").split("@")[0];
    const base = normalizeUsername(emailLocalPart);

    let candidate = base;
    let suffix = 2;
    while (taken.has(candidate)) {
      candidate = `${base}_${suffix}`;
      suffix += 1;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { username: candidate },
    });

    taken.add(candidate);
    updated += 1;
  }

  console.log(`Backfill completado. Usuarios actualizados: ${updated}`);
}

main()
  .catch((error) => {
    console.error("Error en backfill de usernames:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
