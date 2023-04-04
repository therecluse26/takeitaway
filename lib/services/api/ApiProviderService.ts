import { PrismaClient, Address, User, Provider, ProviderTimeOff } from "@prisma/client";
import { PaginatedResults } from "../../../types/pagination";
import { Availability } from "../../../types/provider";
import { Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export type ProviderWithAddress = Provider & {
  address: Address; 
}

export type ProviderWithRelations = ProviderWithAddress & {
  user: User;
  timeOff: ProviderTimeOff[]|null;
}

export type PaginatedProvidersWithRelations = PaginatedResults & {
  data: ProviderWithRelations[];
}

export function formatAddress(address: Address): string {
  return address.street + ", " + address.city + ", " + address.state + " " + address.zip
}

export async function updateAvailability(id: string, availability: Availability[]): Promise<Provider|null> {
  return await prisma.provider.update({
    where: {
      id: id
    },
    data: {
     availability: availability
    }
  });
}

export async function getAllProviders(): Promise<Provider[]> {
  return await prisma.provider.findMany();
}


export async function getAllProvidersWithAddress(): Promise<ProviderWithAddress[]> {
  return await prisma.provider.findMany({
    include: {
      address: true,
    }
  });
}

export async function getProviderWithAddress(id: string): Promise<ProviderWithAddress|null> {
  return await prisma.provider.findUnique({
    where: {
      id: id
    },
    include: {
      address: true,
    }
  });
}

export async function getProviderWithRelations(id: string): Promise<ProviderWithRelations|null> {
  return await prisma.provider.findUnique({
    where: {
      id: id
    },
    include: {
      user: true,
      address: true,
      timeOff: {
        where: {
          day: {
            gte: new Date()
          }
        }
      },
    }
  });
}

export async function getPaginatedProviders(paginatedQuery: any) {
  return await prisma.provider.findMany(
    {
      ...paginatedQuery,
      include: {
        user: true,
        address: true,
      }
    }
  );
}

export async function getUnpaginatedProvidersCount(unpaginatedQuery: any) {
  return await prisma.provider.count(unpaginatedQuery);
}

export async function createProviderFromUser(user: User): Promise<Provider> {
  const providerData =  {
    userId: user.id,
    addressId: user.billingAddressId ?? undefined,
    serviceRadius: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    availability: Prisma.DbNull,
    deleted: false,
  }  as Prisma.ProviderCreateManyInput

  return await prisma.provider.create({
    data: providerData,
  });
}

export async function deleteProvider(id: string): Promise<boolean> {
  return await prisma.provider.update({
    where: {
      id: id
    },
    data: {
      deleted: true
    }
  }).then(() => true);
}