import { Address, PrismaClient, RoleEnum, ServiceType } from '@prisma/client'
const prisma = new PrismaClient()
import { faker } from "@faker-js/faker";
import { createOrUpdateStripeProducts } from '../lib/services/api/ApiStripeService';

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
                        name: 'Single Pickup',
                        description: `Each subscription service pick-up will be limited to 3 cans per household (1 recycle can/ 2 garbage cans)
                        <br/>
                        Any overflow trash (more than the allotted 3 cans per household) will be charged at $10/ 33 gallon trash bag of overflow garbage and will be billed to your credit card on your next billing statement.`,
                        price: 30,
                        perCycle: 1,
                        featured: false,
                        displayed: true,
                        productPhoto: "/images/products/1pickups.jpg",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }, 
                    {
                        type: ServiceType.recurring,
                        name: '2 Pickups',
                        description: `Each subscription service pick-up will be limited to 3 cans per household (1 recycle can/ 2 garbage cans)
                        <br/>
                        Any overflow trash (more than the allotted 3 cans per household) will be charged at $10/ 33 gallon trash bag of overflow garbage and will be billed to your credit card on your next billing statement.`,
                        price: 55,
                        perCycle: 2,
                        featured: true,
                        displayed: true,
                        productPhoto: "/images/products/2pickups.jpg",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }, 
                    {
                        type: ServiceType.recurring,
                        name: '4 Pickups',
                        description: `Each subscription service pick-up will be limited to 3 cans per household (1 recycle can/ 2 garbage cans)
                        <br/>
                        Any overflow trash (more than the allotted 3 cans per household) will be charged at $10/ 33 gallon trash bag of overflow garbage and will be billed to your credit card on your next billing statement.`,
                        price: 95,
                        perCycle: 4,
                        featured: true,
                        displayed: true,
                        productPhoto: "/images/products/4pickups.jpg",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }, 
                    {
                        type: ServiceType.recurring,
                        name: '6 pickups',
                        description: `Each subscription service pick-up will be limited to 3 cans per household (1 recycle can/ 2 garbage cans)
                        <br/>
                        Any overflow trash (more than the allotted 3 cans per household) will be charged at $10/ 33 gallon trash bag of overflow garbage and will be billed to your credit card on your next billing statement.`,
                        price: 130,
                        perCycle: 6,
                        featured: true,
                        displayed: true,
                        productPhoto: "/images/products/6pickups.jpg",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        type: ServiceType.recurring,
                        name: '10 pickups',
                        description: `<ul>
                            <li>Usually for multiple property owners or property management companies</li>
                            <li>Amount of pick-ups may be shared in between multiple properties)</li>
                        </ul>
                        Each subscription service pick-up will be limited to 3 cans per household (1 recycle can/ 2 garbage cans)
                        <br/>
                        Any overflow trash (more than the allotted 3 cans per household) will be charged at $10/ 33 gallon trash bag of overflow garbage and will be billed to your credit card on your next billing statement.`,
                        price: 200,
                        perCycle: 10,
                        featured: false,
                        displayed: true,
                        productPhoto: "/images/products/10pickups.jpg",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        type: ServiceType.recurring,
                        name: '15 pickups',
                        description: `<ul>
                            <li>Usually for multiple property owners or property management companies</li>
                            <li>Amount of pick-ups may be shared in between multiple properties)</li>
                        </ul>
                        Each subscription service pick-up will be limited to 3 cans per household (1 recycle can/ 2 garbage cans)
                        <br/>
                        Any overflow trash (more than the allotted 3 cans per household) will be charged at $10/ 33 gallon trash bag of overflow garbage and will be billed to your credit card on your next billing statement.`,
                        price: 295,
                        perCycle: 15,
                        featured: false,
                        displayed: true,
                        productPhoto: "/images/products/15pickups.jpg",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        type: ServiceType.recurring,
                        name: '20 pickups',
                        description: `<ul>
                            <li>Usually for multiple property owners or property management companies</li>
                            <li>Amount of pick-ups may be shared in between multiple properties)</li>
                        </ul>
                        Each subscription service pick-up will be limited to 3 cans per household (1 recycle can/ 2 garbage cans)
                        <br/>
                        Any overflow trash (more than the allotted 3 cans per household) will be charged at $10/ 33 gallon trash bag of overflow garbage and will be billed to your credit card on your next billing statement.`,
                        price: 385,
                        perCycle: 20,
                        featured: false,
                        displayed: true,
                        productPhoto: "/images/products/20pickups.jpg",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {
                        type: ServiceType.oneTime,
                        name: 'One-Time Pickup',
                        description: 'Single pickup',
                        price: 60,
                        featured: false,
                        displayed: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {     
                        type: ServiceType.addOn,
                        name: 'Overage',
                        description: 'Overage charge',
                        price: 10,
                        featured: false,
                        displayed: false,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    {     
                        type: ServiceType.addOn,
                        name: 'Large Item',
                        description: 'Large item charge',
                        price: 15,
                        featured: false,
                        displayed: false,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                ],
                skipDuplicates: true,
            }
        );

        const services = await prisma.service.findMany();

        await createOrUpdateStripeProducts(services)

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

