import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testQueries() {
  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        userId: 2,
        date: {
          gte: new Date('2025-01-01'),
          lte: new Date('2025-01-31'),
        },
      },
    });
    console.log('Attendance Data:', attendance);

    const activities = await prisma.activity.findMany({
      where: {
        userId: 2,
        date: {
          gte: new Date('2025-01-01'),
          lte: new Date('2025-01-31'),
        },
      },
    });
    console.log('Activities Data:', activities);
  } catch (error) {
    console.error('Error running queries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testQueries();
