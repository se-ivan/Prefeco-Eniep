import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pkgPrisma from '@prisma/client';
import bcrypt from 'bcryptjs';

const { PrismaClient } = pkgPrisma;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the test environment variables explicitly
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

const prisma = new PrismaClient();

async function main() {
  console.log('Starting E2E database seeding on branch database...');

  // 1. Ensure Test Institution exists
  const instCct = '15SBC9999Z';
  const institucion = await prisma.institucion.upsert({
    where: { cct: instCct },
    update: {
      nombre: 'Preparatoria Test E2E',
      estado: 'México',
      municipio: 'Melchor Ocampo',
      telefono: '5512345678',
      nombreDirector: 'Director Test E2E',
    },
    create: {
      cct: instCct,
      nombre: 'Preparatoria Test E2E',
      estado: 'México',
      municipio: 'Melchor Ocampo',
      telefono: '5512345678',
      nombreDirector: 'Director Test E2E',
    },
  });
  console.log(`Test Institution verified: ${institucion.nombre} (ID: ${institucion.id})`);

  // Hashed password for 'Password123!'
  const saltRounds = 10;
  const passwordHash = bcrypt.hashSync('Password123!', saltRounds);

  // 2. Ensure Admin User 'admin_test'
  const adminUserId = 'e2e_admin_test_user_id';
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin_test' },
    update: {
      name: 'Administrador Test E2E',
      email: 'admin_test@local.eniep',
      role: 'ADMIN',
      emailVerified: true,
    },
    create: {
      id: adminUserId,
      name: 'Administrador Test E2E',
      email: 'admin_test@local.eniep',
      username: 'admin_test',
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  console.log(`Admin user verified: ${adminUser.username} (ID: ${adminUser.id})`);

  // Ensure Admin Account
  const adminAccount = await prisma.account.upsert({
    where: { id: 'e2e_admin_test_account_id' },
    update: {
      password: passwordHash,
    },
    create: {
      id: 'e2e_admin_test_account_id',
      accountId: adminUser.id,
      providerId: 'credential',
      userId: adminUser.id,
      password: passwordHash,
    },
  });
  console.log('Admin account credentials verified.');

  // 3. Ensure Coordinator User 'prueba'
  const coordinatorUserId = 'e2e_coordinator_prueba_user_id';
  const coordinatorUser = await prisma.user.upsert({
    where: { username: 'prueba' },
    update: {
      name: 'Coordinador Prueba E2E',
      email: 'prueba@local.eniep',
      role: 'RESPONSABLE_INSTITUCION',
      institucionId: institucion.id,
      emailVerified: true,
    },
    create: {
      id: coordinatorUserId,
      name: 'Coordinador Prueba E2E',
      email: 'prueba@local.eniep',
      username: 'prueba',
      role: 'RESPONSABLE_INSTITUCION',
      institucionId: institucion.id,
      emailVerified: true,
    },
  });
  console.log(`Coordinator user verified: ${coordinatorUser.username} (ID: ${coordinatorUser.id})`);

  // Ensure Coordinator Account
  const coordinatorAccount = await prisma.account.upsert({
    where: { id: 'e2e_coordinator_prueba_account_id' },
    update: {
      password: passwordHash,
    },
    create: {
      id: 'e2e_coordinator_prueba_account_id',
      accountId: coordinatorUser.id,
      providerId: 'credential',
      userId: coordinatorUser.id,
      password: passwordHash,
    },
  });
  console.log('Coordinator account credentials verified.');

  // 4. Ensure some base disciplines exist
  const baseDisciplinas = [
    { nombre: 'Fútbol Varonil', tipo: 'DEPORTIVA', rama: 'VARONIL', modalidad: 'EQUIPO' },
    { nombre: 'Taekwondo Femenil', tipo: 'DEPORTIVA', rama: 'FEMENIL', modalidad: 'INDIVIDUAL' },
    { nombre: 'Oratoria Única', tipo: 'CULTURAL', rama: 'UNICA', modalidad: 'INDIVIDUAL' },
  ];

  for (const disc of baseDisciplinas) {
    // Create base discipline first if needed
    const dbBase = await prisma.disciplinaBase.upsert({
      where: { nombre_tipo: { nombre: disc.nombre, tipo: disc.tipo } },
      update: {},
      create: {
        nombre: disc.nombre,
        tipo: disc.tipo,
      },
    });

    const disciplina = await prisma.disciplina.create({
      data: {
        nombre: disc.nombre,
        tipo: disc.tipo,
        rama: disc.rama,
        modalidad: disc.modalidad,
        disciplinaBaseId: dbBase.id,
        categorias: {
          create: [
            { nombre: 'Única' },
          ],
        },
      },
    }).catch(() => {
      // Ignore if already exists (we just need them in db)
    });
  }
  console.log('Disciplines seeding verified.');

  console.log('E2E database seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error('Error during E2E seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
