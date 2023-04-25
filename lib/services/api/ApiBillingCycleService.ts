import { PrismaClient, BillingCycle, SubscriptionStatus, Subscription } from "@prisma/client";
import day from "dayjs";

const prisma = new PrismaClient()

export type BillingCycleData = {
    userId: string;
    subscriptionId: string;
    startDate: Date;
    endDate: Date;
    amount: number;
    active: boolean;
    pickups: number;
}

export type BillingCycleUpdateData = {
    subscriptionId?: string;
    startDate?: Date;
    endDate?: Date;
    amount?: number;
    active?: boolean;
    pickups?: number;
}

export async function createBillingCycle(billingCycle: BillingCycleData): Promise<BillingCycle> {
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

export async function updateBillingCycle(id: string, billingCycleData: BillingCycleUpdateData): Promise<BillingCycle> {
    return await prisma.billingCycle.update({
        where: {
            id: id
        },
        data: billingCycleData
    });
}

export async function getUserCurrentBillingCycle(userId: string): Promise<BillingCycle | null> {
    return await prisma.billingCycle.findFirst({
        where: {
            userId: userId,
            active: true,
            startDate: {
                lte: new Date()
            },
            endDate: {
                gte: new Date()
            }
        }
    });
}

export async function getUserMostRecentActiveBillingCycle(userId: string): Promise<BillingCycle | null> {
    return await prisma.billingCycle.findFirst({
        where: {
            userId: userId,
            active: true,
        },
        orderBy: {
            endDate: 'desc'
        }
    });
}

export async function generateNextBillingCycle(subscription: Subscription): Promise<BillingCycle | null> {
    
    if (subscription.status !== SubscriptionStatus.active && subscription.status !== SubscriptionStatus.trialing) {
        throw new Error("User subscription is not active");
    }
   
    const previousBillingCycle = await getUserMostRecentActiveBillingCycle(subscription.userId);
    const currentDate = new Date();
    // If billing cycle still has days left, don't generate new billing cycle
    if (previousBillingCycle?.endDate && day(previousBillingCycle.endDate).isAfter(currentDate)) {
        return null;
    }

    let rolloverPickups = 0;

    if (previousBillingCycle) {
        // Count service logs from billing cycle and get remainder from billing cycle pickups 
        const serviceLogsCount = await prisma.serviceLog.count({
            where: {
                billingCycleId: previousBillingCycle.id,
                createdAt: {
                    gte: previousBillingCycle?.startDate,
                    lte: previousBillingCycle?.endDate
                }
            }
        });

        rolloverPickups = previousBillingCycle?.pickups ? (previousBillingCycle?.pickups - serviceLogsCount) > 0 ? previousBillingCycle?.pickups - serviceLogsCount : 0 : 0;

        // Set current billing cycle to inactive
        await updateBillingCycle(previousBillingCycle.id, {
            active: false
        });
    }
    // Create new start date by adding 1 to end date of previous billing cycle
    const newStartDate = previousBillingCycle?.endDate ? day(previousBillingCycle.endDate).add(1, 'day').toDate() : currentDate;
    // Create new end date by adding 30 days to new start date
    const newEndDate = day(newStartDate).add(30, 'day').toDate();

    // Calculate pickups for next cycle
    const pickupsForNextCycle = subscription.pickupsPerCycle + rolloverPickups;

    const nextBillingCycle = await createBillingCycle({
        userId: subscription.userId,
        subscriptionId: subscription.id,
        startDate: newStartDate,
        endDate: newEndDate,
        amount: subscription.amount ?? 0,
        active: true,
        pickups: pickupsForNextCycle
    });

    return nextBillingCycle;
}