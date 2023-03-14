import { PrismaClient, BillingCycle } from "@prisma/client";

const prisma = new PrismaClient()

export async function createBillingCycle(billingCycle: BillingCycle): Promise<BillingCycle> {
    return await prisma.billingCycle.create({
        data: billingCycle
    });
}

export async function getBillingCycle(id: string): Promise<BillingCycle | null> {
    return await prisma.billingCycle.findUnique({
        where: {
            id: id
        }
    });
}

export async function getBillingCycles(): Promise<BillingCycle[]> {
    return await prisma.billingCycle.findMany();
}

export async function updateBillingCycle(id: string, billingCycle: BillingCycle): Promise<BillingCycle> {
    return await prisma.billingCycle.update({
        where: {
            id: id
        },
        data: billingCycle
    });
}