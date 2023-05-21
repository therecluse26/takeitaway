import { Service } from "@prisma/client";
import { createStripeProduct } from "./ApiStripeService";
import prisma from "../../prismadb";

export async function getFeaturedServices(): Promise<Service[]> {
    return await prisma.service.findMany({
        where: {
            featured: true,
            displayed: true
        }
    })
}

export async function getDisplayedServices(): Promise<Service[]> {
    return await prisma.service.findMany({
        where: {
            displayed: true
        }
    })
}

export async function getExtraServices(): Promise<Service[]> {
    return await prisma.service.findMany({
        where: {
            displayed: false
        }
    })
}

export async function getServiceById(id: string): Promise<Service> {
    const service = await prisma.service.findUnique({
        where: {
            id: id
        }
    })

    if (!service) {
        throw new Error("Service not found");
    }

    return service;
}

export async function createService(service: Service): Promise<Service> {
    const newService = await prisma.service.create({
        data: service
    })

    await createStripeProduct(newService)

    return newService;
}

export async function updateService(service: Service): Promise<Service> {
    const updatedService = await prisma.service.update({
        where: {
            id: service.id
        },
        data: service
    })

    return updatedService;
}

export async function countServiceLogsForPastNCycles(subscriptionId: string, cycles: number): Promise<{ allocated: number, used: number, leftover: number }> {
    const date = new Date();
    const nBillingCycles = await prisma.billingCycle.findMany({
        where: {
            subscriptionId: subscriptionId
        },
        orderBy: {
            startDate: 'desc'
        },
        take: cycles.valueOf()
    });

    const allocated = nBillingCycles.reduce((acc, billingCycle) => {
        return acc + billingCycle.pickups.valueOf();
    }, 0);

    const used = await prisma.serviceLog.count({
        where: {
            billingCycleId: {
                in: nBillingCycles.map((billingCycle) => billingCycle.id)
            },
            createdAt: {
                gte: date
            }
        }
    })

    return {
        allocated: allocated,
        used: used,
        leftover: allocated - used
    };
}