import { PrismaClient, PaymentMethod as UserPaymentMethod } from "@prisma/client";
import { PaymentMethod } from "@stripe/stripe-js";
import { User } from "next-auth/core/types";

const prisma = new PrismaClient()

export async function savePaymentMethodToUser(paymentMethod: PaymentMethod, user: User): Promise<UserPaymentMethod>{
  const updatedPaymentMethod = await prisma.paymentMethod.upsert({
    where:{
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

export async function setPaymentMethodAsDefault(paymentMethod: UserPaymentMethod): Promise<UserPaymentMethod>{
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

export async function getPaymentMethodsForUser(user: User): Promise<UserPaymentMethod[]>{
  return prisma.paymentMethod.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function getPaymentMethodByStripeId(id: string): Promise<UserPaymentMethod|null>{
  return await prisma.paymentMethod.findUnique({
    where: {
      stripeId: id
    }
  });
}

export async function getPaymentMethodById(id: string): Promise<UserPaymentMethod|null>{
  return await prisma.paymentMethod.findUnique({
    where: {
      id: id
    }
  });
  
}

export async function deleteAccount(user: User): Promise<boolean>{
  
  return await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      deleted: true
    }
    
  }).then(() => true);
}