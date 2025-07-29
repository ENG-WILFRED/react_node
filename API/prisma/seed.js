const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password123.', 10);

  // Create users
  const users = [
    {
      id: uuidv4(),
      email: 'peter@easytrans.com',
      password,
      role: 'psp',
      firstName: 'Peter',
      lastName: 'PSP',
    },
    {
      id: uuidv4(),
      email: 'devon@easytrans.com',
      password,
      role: 'dev',
      firstName: 'Devon',
      lastName: 'Dev',
    },
    {
      id: uuidv4(),
      email: 'paul@easytrans.com',
      password,
      role: 'psp',
      firstName: 'Paul',
      lastName: 'PSP',
    },
    {
      id: uuidv4(),
      email: 'dana@easytrans.com',
      password,
      role: 'dev',
      firstName: 'Dana',
      lastName: 'Dev',
    },
  ];

  await Promise.all(users.map(user => prisma.user.create({ data: user })));

  // Create transactions for these users
  await Promise.all([
    prisma.transaction.create({
      data: {
        userId: users[0].id,
        recipient: users[1].email,
        amount: 5000,
        status: 'success',
        currency: 'USD',
        description: 'PSP received payment',
      },
    }),
    prisma.transaction.create({
      data: {
        userId: users[1].id,
        recipient: users[0].email,
        amount: 1200,
        status: 'pending',
        currency: 'USD',
        description: 'Dev payout processing',
      },
    }),
    prisma.transaction.create({
      data: {
        userId: users[2].id,
        recipient: users[0].email,
        amount: 2000,
        status: 'failed',
        currency: 'USD',
        description: 'PSP failed top-up',
      },
    }),
    prisma.transaction.create({
      data: {
        userId: users[3].id,
        recipient: users[2].email,
        amount: 4500,
        status: 'success',
        currency: 'USD',
        description: 'Dev successful transfer',
      },
    }),
    prisma.transaction.create({
      data: {
        userId: users[0].id,
        recipient: users[3].email,
        amount: 3300,
        status: 'pending',
        currency: 'USD',
        description: 'PSP withdrawal in progress',
      },
    }),
  ]);

  console.log('✅ Seeded 4 users and 5 transactions.');
}

main()
  .catch((err) => {
    console.error('❌ Error during seed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
