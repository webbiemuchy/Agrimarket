/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const plainPassword = '121212';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(plainPassword, salt);

  const admins = [
    {
      email: 'admin1@agrimarketsoft.local',
      first_name: 'Admin',
      last_name: 'One',
      user_type: 'admin',
    },
    {
      email: 'admin2@agrimarketsoft.local',
      first_name: 'Admin',
      last_name: 'Two',
      user_type: 'admin',
    },
  ];

  for (const admin of admins) {
    // Ensure idempotency using upsert on unique email
    await prisma.user.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        email: admin.email,
        password_hash: passwordHash,
        first_name: admin.first_name,
        last_name: admin.last_name,
        user_type: admin.user_type,
        is_verified: true,
        is_active: true,
      },
    });
  }

  console.log('Seeded 2 admin users successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


