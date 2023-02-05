import { PrismaClient, Subscription, Recurrence } from ".prisma/client";
import Stripe from "stripe";
import { User } from "next-auth/core/types";
import { getStripeIntegerAsDecimal } from "../../utils/stripe-helpers";

const prisma = new PrismaClient()

export async function stripeSubscriptionExists(subscriptionStripeId: string): Promise<boolean> {  
  return await prisma.subscription.count({
    where: {
      stripeId: subscriptionStripeId
    }
  }) > 0;
}

export async function getSubscriptionByStripeId(subscriptionStripeId: string): Promise<Subscription | null> {    
  return await prisma.subscription.findUnique({
    where: {
      stripeId: subscriptionStripeId
    }
  });
}

export async function getSubscriptionById(id: string): Promise<Subscription | null> {    
  return await prisma.subscription.findUnique({
    where: {
      id: id
    }
  });
}

export async function saveSubscriptionToUser(stripeSubscription: Stripe.Subscription, user: User): Promise<Subscription>{

  const itemTotalPickupCount = stripeSubscription.items?.data.reduce((total: number, item: Stripe.SubscriptionItem) => {
    const product: Stripe.Product = item?.price?.product as Stripe.Product;
    if(product){
      return total + (parseInt(product.metadata.pickupsPerCycle ?? 0) * (item.quantity ?? 1));
    }
    return total;
  }, 0);

  let amount: number = stripeSubscription.items?.data.reduce((total: number, item) => {
    return total + (item.price?.unit_amount ?? 0);
  }, 0);

  const localSubscription: Subscription = await prisma.subscription.upsert({
    where:{
      stripeId: stripeSubscription.id
    },
    update: {
      userId: user.id,
      cycleRecurrence: Recurrence.monthly,
      pickupsPerCycle: itemTotalPickupCount,
      active: stripeSubscription.status === "active",
      amount: getStripeIntegerAsDecimal(amount),
      updatedAt: new Date()
    },
    create: {
      userId: user.id,
      stripeId: stripeSubscription.id,
      cycleRecurrence: Recurrence.monthly,
      pickupsPerCycle: itemTotalPickupCount,
      active: stripeSubscription.status === "active",
      amount: getStripeIntegerAsDecimal(amount),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
  return localSubscription;
}
