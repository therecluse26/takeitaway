import { PrismaClient, Service } from "@prisma/client";
import { createStripeProduct } from "./ApiStripeService";

const prisma = new PrismaClient();

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

    if(!service){
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