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

export async function saveSubscriptionToUser(subscription: Stripe.Subscription, user: User): Promise<Subscription>{

  const itemTotalQuantity = subscription.items?.data.reduce((total: number, item) => {
    const product: Stripe.Product = item?.price?.product as Stripe.Product;
    if(product){
      return total + (parseInt(product.metadata.pickupsPerCycle ?? 0));
    }
    return total;
  }, 0);

  let amount: number = subscription.items?.data.reduce((total: number, item) => {
    return total + (item.price?.unit_amount ?? 0);
  }, 0);

  const updatedSubscription = await prisma.subscription.upsert({
    where:{
      stripeId: subscription.id
    },
    update: {
      userId: user.id,
      cycleRecurrence: Recurrence.monthly,
      pickupsPerCycle: itemTotalQuantity,
      active: subscription.status === "active",
      amount: getStripeIntegerAsDecimal(amount),
      updatedAt: new Date()
    },
    create: {
      userId: user.id,
      stripeId: subscription.id,
      cycleRecurrence: Recurrence.monthly,
      pickupsPerCycle: itemTotalQuantity,
      active: subscription.status === "active",
      amount: getStripeIntegerAsDecimal(amount),
      createdAt: new Date(),
      updatedAt: new Date()
    } as Subscription
  });

  return updatedSubscription;
}
