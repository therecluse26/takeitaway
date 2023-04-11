import { PrismaClient, Address, User, Provider, ProviderTimeOff } from "@prisma/client";
import { PaginatedResults } from "../../../types/pagination";
import { Availability } from "../../../types/provider";
import { Prisma } from '@prisma/client'
import { geocodeAddress, getMilesBetweenCoordinates } from "./ApiAddressService";

const prisma = new PrismaClient()

export type ProviderWithAddress = Provider & {
  address: Address; 
}

export type ProviderWithTimeOff = Provider & {
  timeOff: ProviderTimeOff[]|null;
}

export type ProviderWithUser = Provider & {
  user: User;
}

export type ProviderWithRelations = ProviderWithAddress & ProviderWithTimeOff & ProviderWithUser;

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

export async function getProvidersWithAvailability(date: Date): Promise<ProviderWithTimeOff[]|ProviderWithRelations[]> {
  return await prisma.provider.findMany({
    where: {
      availability: {
        not: undefined || null || []
      } 
    },
    include: {
      user: true,
      address: true,
      timeOff: {
        where: {
          day: {
            not: date
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

export async function getNearestProviderByAddress(address: Address, providers: ProviderWithRelations[]): Promise<Provider>
{
  let geocodedAddress = address;
  if(!geocodedAddress.latitude || !geocodedAddress.longitude) {
    // Geocode address
    geocodedAddress = await geocodeAddress(address);
  } 

  if (!geocodedAddress.latitude || !geocodedAddress.longitude) {
    // If geocoding fails, throw error
    throw new Error("Could not geocode address for address with id: " + geocodedAddress.id + "");
  }

  const providersWithDistance = providers.map(async (provider) => {

    if(!provider.address.latitude || !provider.address.longitude) {
      // Geocode address
      provider.address = await geocodeAddress(provider.address);
    }

    if(!provider.address.latitude || !provider.address.longitude) {
      // If geocoding fails, throw error
      throw new Error("Could not geocode address for provider with id: " + provider.id + "");
    }

    return {
      provider: provider,
      distance: getMilesBetweenCoordinates(geocodedAddress.latitude ?? -90.0000, geocodedAddress.longitude ?? 0.0000, provider.address.latitude ?? 90.0000, provider.address.longitude ?? 0.0000)
    }
  }) as Promise<{provider: Provider, distance: Number}>[];

  const nearestProvider = await providersWithDistance.reduce((prev: any, current: any) => (prev.distance < current.distance) ? prev : current);

  return nearestProvider.provider;
}