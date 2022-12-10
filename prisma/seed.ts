import { PrismaClient } from '@prisma/client'
import { permissionData, rolePermissionData } from './permissions';
const prisma = new PrismaClient()

async function main() {
    // Create base permissions
    await prisma.permission.createMany({
        data: permissionData,
        skipDuplicates: true
    });

    // Assign permissions to roles
    await prisma.rolePermission.createMany({
        data: rolePermissionData.flat(),
        skipDuplicates: true
    });
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

