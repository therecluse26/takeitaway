import { PrismaClient, Address, User, Provider, ProviderTimeOff } from "@prisma/client";
import { PaginatedResults } from "../../../types/pagination";

const prisma = new PrismaClient()

export type ProviderWithRelations = Provider & {
  user: User;
  address: Address; 
  timeOff: ProviderTimeOff[]|null;
}

export type PaginatedProvidersWithRelations = PaginatedResults & {
  data: ProviderWithRelations[];
}

export function formatAddress(address: Address): string {
  return address.street + ", " + address.city + ", " + address.state + " " + address.zip
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
