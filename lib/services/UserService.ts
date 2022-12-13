import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function getUserCount(): Promise<number> {
    return await prisma.user.count().finally(() => {
        prisma.$disconnect();
    });
}

export { getUserCount };