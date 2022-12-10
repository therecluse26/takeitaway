import { PrismaClient } from '@prisma/client'
import { Permissions, Roles, RolePermissions } from './permissions';
const prisma = new PrismaClient()

async function main() {
    // run seeders here
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

