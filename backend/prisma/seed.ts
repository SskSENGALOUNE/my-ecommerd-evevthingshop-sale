import { PrismaClient, AdminRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // ============================================
  // ADMINS
  // ============================================

  const superAdminEmail = 'superadmin@shop.com';
  const existingSuperAdmin = await prisma.admin.findUnique({ where: { email: superAdminEmail } });

  if (!existingSuperAdmin) {
    const hashed = await bcrypt.hash('SuperAdmin@1234', 10);
    const superAdmin = await prisma.admin.create({
      data: {
        email: superAdminEmail,
        password: hashed,
        name: 'Super Admin',
        role: AdminRole.SUPER_ADMIN,
      },
    });
    console.log(`✔ SUPER_ADMIN created: ${superAdmin.email}`);
  } else {
    console.log(`– SUPER_ADMIN already exists, skipping.`);
  }

  const adminEmail = 'admin@shop.com';
  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashed = await bcrypt.hash('Admin@1234', 10);
    const admin = await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashed,
        name: 'Admin',
        role: AdminRole.ADMIN,
      },
    });
    console.log(`✔ ADMIN created: ${admin.email}`);
  } else {
    console.log(`– ADMIN already exists, skipping.`);
  }

  // ============================================
  // CUSTOMER
  // ============================================

  const customerEmail = 'customer@shop.com';
  const existingCustomer = await prisma.customer.findUnique({ where: { email: customerEmail } });

  if (!existingCustomer) {
    const hashed = await bcrypt.hash('Customer@1234', 10);
    const customer = await prisma.customer.create({
      data: {
        email: customerEmail,
        password: hashed,
        name: 'Test Customer',
        phone: '0812345678',
      },
    });
    console.log(`✔ CUSTOMER created: ${customer.email}`);
  } else {
    console.log(`– CUSTOMER already exists, skipping.`);
  }

  console.log('\nSeed credentials:');
  console.log('  SUPER_ADMIN  superadmin@shop.com  /  SuperAdmin@1234');
  console.log('  ADMIN        admin@shop.com        /  Admin@1234');
  console.log('  CUSTOMER     customer@shop.com     /  Customer@1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
