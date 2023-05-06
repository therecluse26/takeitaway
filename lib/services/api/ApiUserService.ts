import { PrismaClient, PaymentMethod as UserPaymentMethod, Address, Subscription, BillingCycle, PickupPreference, Provider } from "@prisma/client";
import { PaymentMethod } from "@stripe/stripe-js";
import { User } from "next-auth/core/types";
import {User as PrismaUser} from "@prisma/client"
import { AddressWithPickupPreferences } from "./ApiAddressService";

const prisma = new PrismaClient()

export type UserWithAddresses = User & {
  addresses: AddressWithPickupPreferences[];
}

export type UserWithSubscription = User & {
  subscription: Subscription | null;
}

export interface SubscriptionWithBillingCycles extends Subscription {
  billingCycles: BillingCycle[];
}

export type UserWithBillingCycles = User & {
  subscription: SubscriptionWithBillingCycles | null;
  addresses: AddressWithPickupPreferences[];
}

export type UserWithRelations = UserWithBillingCycles & {
  billingAddress: Address | null;
  paymentMethods: UserPaymentMethod[];
}

export type UserProvider = UserWithRelations & {
  provider: Provider | null;
}

export async function getUserWithProvider(id: string): Promise<UserProvider | null> {
  return await prisma.user.findUnique({
    where: {
      id: id
    },
    include: {
      addresses: {
        where: {
          type: "service"
        }
      },
      billingAddress: true,
      paymentMethods: true,
      subscription: true,
      provider: true,
    }
  }) as UserProvider;
}

export async function getUserWithAddresses(id: string): Promise<UserWithAddresses | null> {
  return await prisma.user.findUnique({
    where: {
      id: id
    },
    include: {
      addresses: {
        where: {
          type: "service"
        },
        include: {
          pickupPreferences: true
        }
      }
    }
  });
}

export async function getUserWithSubscription(id: string): Promise<UserWithSubscription | null> {
  return await prisma.user.findUnique({
    where: {
      id: id
    },
    include: {
      subscription: true
    }
  });
}

export async function getUserWithBillingCycles(id: string): Promise<UserWithBillingCycles | null> {
  return await prisma.user.findUnique({
    where: {
      id: id
    },
    include: {
      addresses: {
        where: {
          type: "service"
        },
        include: {
          pickupPreferences: true
        }
      },
      subscription: {
        include: {
          billingCycles: {
            orderBy: {
              startDate: "asc"
            },
            take: 1
          }
        }
      },
    }
  });
}


export async function getUser(id: string): Promise<User | PrismaUser | null> {
  return await prisma.user.findUnique({
    where: {
      id: id
    }
  });
}



export async function getUserWithRelations(id: string): Promise<UserWithRelations | null> {
  return await prisma.user.findUnique({
    where: {
      id: id
    },
    include: {
      addresses: {
        where: {
          type: "service"
        }
      },
      billingAddress: true,
      paymentMethods: true,
      subscription: {
        include: {
          billingCycles: true
        }
      },
    }
  }) as UserWithRelations
}

export async function getPaginatedUsers(paginatedQuery: any) {
  return await prisma.user.findMany(
    {
      ...paginatedQuery,
      include: {
        _count: {
          select: {
            addresses: true,
          }
        }
      }
    }
  );
}

export async function getUnpaginatedUsersCount(unpaginatedQuery: any) {
  return await prisma.user.count(unpaginatedQuery);
}

export async function savePaymentMethodToUser(paymentMethod: PaymentMethod, user: User): Promise<UserPaymentMethod> {
  const updatedPaymentMethod = await prisma.paymentMethod.upsert({
    where: {
      stripeId: paymentMethod.id
    },
    update: {
      userId: user.id,
      stripeId: paymentMethod.id,
      brand: paymentMethod.card?.brand,
      last4: paymentMethod.card?.last4,
      expMonth: paymentMethod.card?.exp_month,
      expYear: paymentMethod.card?.exp_year,
      updatedAt: new Date()
    },
    create: {
      userId: user.id,
      stripeId: paymentMethod.id,
      brand: paymentMethod.card?.brand,
      last4: paymentMethod.card?.last4,
      expMonth: paymentMethod.card?.exp_month,
      expYear: paymentMethod.card?.exp_year,
      createdAt: new Date(),
      updatedAt: new Date()
    } as UserPaymentMethod
  });

  setPaymentMethodAsDefault(updatedPaymentMethod);

  return updatedPaymentMethod;
}

export async function setPaymentMethodAsDefault(paymentMethod: UserPaymentMethod): Promise<UserPaymentMethod> {
  // Set all other payment methods to not default
  await prisma.paymentMethod.updateMany({
    where: {
      userId: paymentMethod.userId,
      id: {
        not: paymentMethod.id
      }
    },
    data: {
      default: false
    }
  });

  // Set this payment method to default
  return prisma.paymentMethod.update({
    where: {
      id: paymentMethod.id
    },
    data: {
      default: true
    }
  });
}

export async function getPaymentMethodsForUser(user: User): Promise<UserPaymentMethod[]> {
  return prisma.paymentMethod.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getPaymentMethodByStripeId(id: string): Promise<UserPaymentMethod | null> {
  return await prisma.paymentMethod.findUnique({
    where: {
      stripeId: id
    }
  });
}

export async function getPaymentMethodById(id: string): Promise<UserPaymentMethod | null> {
  return await prisma.paymentMethod.findUnique({
    where: {
      id: id
    }
  });
}

export async function deleteAccount(user: User): Promise<boolean> {

  return await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      deleted: true
    }

  }).then(() => true);
}

export async function saveUserPickupPreferences(userId: string, preferences: PickupPreference[]): Promise<UserWithRelations|null> {

  const updatePickupCountQueries = preferences.map(preference => {
    return updateAddressPickupsAllocatedCount(preference.addressId,
      preferences.reduce((acc, cur) => {
        if (cur.addressId === preference.addressId) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0)
    );
  });

  await prisma.$transaction([
    prisma.pickupPreference.deleteMany({
      where: {
        userId: userId,
      }
    }),
    prisma.pickupPreference.createMany({
      data: preferences.map(preference => {
        return {
          userId: userId,
          addressId: preference.addressId,
          weekday: preference.weekday,
          weekNumber: preference.weekNumber
        }

      })
    }),
    ...updatePickupCountQueries
  ]);

  return await getUserWithRelations(userId);
}

// Async logic will be handled within the transaction
function updateAddressPickupsAllocatedCount(addressId: string, pickupsAllocated: number) {
  return prisma.address.update({
    where: {
      id: addressId
    },
    data: {
      pickupsAllocated: pickupsAllocated
    }
  });
}

// async function updateBillingCyclePickupsRemainingCount(userId: string, billingCycleId: string, pickupsRemaining: number): Promise<BillingCycle> {
//   return await prisma.billingCycle.update({
//       where: {
//           id: billingCycleId
//       },
//       data: {
//           pickupsRemaining: pickupsRemaining
//       }
//   });


export async function getUserPickupPreferences(userId: string): Promise<PickupPreference[]> {
  return await prisma.pickupPreference.findMany({
    where: {
      userId: userId
    }
  });
}

export async function getAddressPickupPreferences(userId: string, addressId: string): Promise<PickupPreference[]> {
  return await prisma.pickupPreference.findMany({
    where: {
      userId: userId,
      addressId: addressId
    }
  });
}