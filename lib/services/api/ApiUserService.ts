import { PrismaClient, PaymentMethod as UserPaymentMethod, Address, Subscription, BillingCycle, PickupPreference } from "@prisma/client";
import { PaymentMethod } from "@stripe/stripe-js";
import { User } from "next-auth/core/types";

const prisma = new PrismaClient()

export type UserWithRelations = User & {
  billingAddress: Address|null;
  billingCycle: BillingCycle|null;
  addresses: Address[];
  subscriptions: Subscription[];
  paymentMethods: UserPaymentMethod[];
}

export async function getUserWithRelations(id: string): Promise<UserWithRelations|null> {
  return await prisma.user.findUnique({
    where: {
      id: id
    },
    include: {
      billingCycle: true,
      billingAddress: true,
      addresses: {
        where: {
          type: "service"
        }
      },
      paymentMethods: true,
      subscriptions: true
    }
  });
}

export async function getPaginatedUsers(paginatedQuery: any) {
  return await prisma.user.findMany(
    {
      ...paginatedQuery,
      include: {
        _count: {
          select: {
            addresses: true,
            subscriptions: true,
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

export async function saveUserPickupPreferences(userId: string, preferences: PickupPreference[]): Promise<void> {
  await prisma.pickupPreference.deleteMany({
      where: {
          userId: userId,
      }
  })
      
  await prisma.pickupPreference.createMany({
        data: preferences.map(preference => {
            return {
                userId: userId,
                addressId: preference.addressId,
                weekday: preference.weekday,
                weekNumber: preference.weekNumber
            }
        })
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