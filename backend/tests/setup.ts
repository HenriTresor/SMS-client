import { PrismaClient } from '@prisma/client';

// Setup test database
const prisma = new PrismaClient();

// Clean up after each test
afterEach(async () => {
  await prisma.transaction.deleteMany();
  await prisma.device.deleteMany();
  await prisma.user.deleteMany();
});

// Clean up after all tests
afterAll(async () => {
  await prisma.$disconnect();
});
