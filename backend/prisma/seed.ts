import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminUsername = 'admin';
  const adminPassword = 'Admin@1234';

  const existing = await prisma.user.findUnique({ where: { username: adminUsername } });
  if (existing) {
    console.log('Admin user already exists, skipping seed.');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      username: adminUsername,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`Admin user created: ${admin.username} (id: ${admin.id})`);
  console.log(`Default password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
