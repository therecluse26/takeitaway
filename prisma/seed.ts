import { PrismaClient, RoleEnum } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {

    await prisma.user.upsert({
        where: { email: 'braddmagyar@gmail.com' },
        update: {
            email: 'braddmagyar@gmail.com',
            name: 'therecluse26',
            role: RoleEnum.admin,
        },
        create: {}
    })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

