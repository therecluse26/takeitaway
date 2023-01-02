import { PrismaClient, UserPaymentMethod } from "@prisma/client";
import { PaymentMethod } from "@stripe/stripe-js";
import { User } from "next-auth/core/types";

const prisma = new PrismaClient()

export async function savePaymentMethodToUser(paymentMethod: PaymentMethod, user: User): Promise<UserPaymentMethod>{
  return prisma.userPaymentMethod.upsert({
    where:{
      paymentMethodId: paymentMethod.id
    },
    update: {
      userId: user.id,
      paymentMethodId: paymentMethod.id,
      brand: paymentMethod.card?.brand,
      last4: paymentMethod.card?.last4,
      expMonth: paymentMethod.card?.exp_month,
      expYear: paymentMethod.card?.exp_year,
      updatedAt: new Date()
    },
    create: {
      userId: user.id,
      paymentMethodId: paymentMethod.id,
      brand: paymentMethod.card?.brand,
      last4: paymentMethod.card?.last4,
      expMonth: paymentMethod.card?.exp_month,
      expYear: paymentMethod.card?.exp_year,
      createdAt: new Date(),
      updatedAt: new Date()
    } as UserPaymentMethod
  });
}

export async function getPaymentMethodsForUser(user: User): Promise<UserPaymentMethod[]>{
  return prisma.userPaymentMethod.findMany({
    where: {
      userId: user.id
    }
  });
}

export async function getPaymentMethodByStripeId(id: string): Promise<UserPaymentMethod|null>{
  return await prisma.userPaymentMethod.findUnique({
    where: {
      paymentMethodId: id
    }
  });
}