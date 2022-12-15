import { PrismaClient, RoleEnum, ServiceType, User } from '@prisma/client'
const prisma = new PrismaClient()
import { faker } from "@faker-js/faker";

async function main() {

    // Run test seeders
    if(!!process.env.SEED_TEST_DATA === true) {
        const userCount = parseInt(process.env.SEED_TEST_USER_COUNT ?? "") ?? 100;
        await prisma.user.createMany(
            {
                data: Array.from({length: userCount }).map(() => {
                        return {
                            email: faker.internet.email(),
                            emailVerified: faker.helpers.arrayElement([new Date(), null]),
                            name: faker.name.fullName(),
                            image: faker.image.avatar(),
                            role: faker.helpers.arrayElement([RoleEnum.provider, RoleEnum.subscriber]),
                        } as User
                    })
                ,
                skipDuplicates: true,
            });

        // Create test services
        await prisma.service.createMany(
            {
                data: [
                    {
                        type: ServiceType.recurring,
                        name: '2 Pickups',
                        description: '2 pickups per month',
                        price: 100,
                        perCycle: 2,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }, 
                    {
                        type: ServiceType.recurring,
                        name: '5 Pickups',
                        description: '5 pickups per month',
                        price: 200,
                        perCycle: 5,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }, 
                    {
                        type: ServiceType.recurring,
                        name: '8 pickups',
                        description: '8 pickups per month',
                        price: 300,
                        perCycle: 8,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        type: ServiceType.oneTime,
                        name: 'One-Time Pickup',
                        description: 'Single pickup',
                        price: 60,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {     
                        type: ServiceType.addOn,
                        name: 'Overage',
                        description: 'Overage charge',
                        price: 10,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {     
                        type: ServiceType.addOn,
                        name: 'Large Item',
                        description: 'Large item charge',
                        price: 15,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                ],
                skipDuplicates: true,
            }
        );
    } 
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

