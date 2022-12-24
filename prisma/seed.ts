import { Address, PrismaClient, RoleEnum, ServiceType } from '@prisma/client'
const prisma = new PrismaClient()
import { faker } from "@faker-js/faker";

function createAddresses(count: number): Array<Address> {
    return Array.from({length: count }).map(() => {
        return {
            street: faker.address.streetAddress(),
            city: faker.address.city(),
            state: faker.address.state(),
            zip: faker.address.zipCode(),
            country: faker.address.country(),
            latitude: parseFloat(faker.address.latitude()),
            longitude: parseFloat(faker.address.longitude()),
        } as Address
    })
}

async function main() {

    // Run test seeders
    if(!!process.env.SEED_TEST_DATA === true) {
        // Create superadmin user
        if(process.env.SUPERADMIN_EMAIL) {
            await prisma.user.create({
                data: {
                    name: process.env.SUPERADMIN_NAME ?? "Super Admin",
                    email: process.env.SUPERADMIN_EMAIL,
                    emailVerified: new Date(),
                    image: faker.image.avatar(),
                    role: RoleEnum.superadmin,
                    addresses: {
                        create: createAddresses(1)
                    }
                }
            })
        }

        const userCount = parseInt(process.env.SEED_TEST_USER_COUNT ?? "") ?? 100;
        for(let i = 0; i < userCount; i++) {
            await prisma.user.create({
                data: {
                    email: faker.internet.email(),
                    emailVerified: faker.helpers.arrayElement([new Date(), null]),
                    name: faker.name.fullName(),
                    image: faker.image.avatar(),
                    role: faker.helpers.arrayElement([RoleEnum.provider, RoleEnum.subscriber]),
                    addresses: {
                        create: createAddresses(faker.datatype.number({min: 0, max: 6}))
                    }
                }
            })
        }


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

