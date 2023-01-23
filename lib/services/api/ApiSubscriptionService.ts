import { PrismaClient, Subscription, Recurrence } from ".prisma/client";
import Stripe from "stripe";
import { User } from "next-auth/core/types";

const prisma = new PrismaClient()

export async function getSubscriptionByStripeId(id: string): Promise<Subscription | null> {
  return await prisma.subscription.findUnique({
    where: {
      stripeId: id
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

  let grossAmount = 0;
  let netAmount = 0;
  let tax = 0;
  let fees = 0;

  subscription.items?.data.forEach(item => {
    grossAmount += item.price?.unit_amount ?? 0;
    netAmount += item.price?.unit_amount ?? 0;
    tax += item.price?.unit_amount ?? 0;
    fees += item.price?.unit_amount ?? 0;
  });



  const updatedSubscription = await prisma.subscription.upsert({
    where:{
      stripeId: subscription.id
    },
    update: {
      userId: user.id,
      stripeId: subscription.id,
      cycleRecurrence: Recurrence.monthly,
      pickupsPerCycle: itemTotalQuantity,
      active: subscription.status === "active",
      updatedAt: new Date()
    },
    create: {
      userId: user.id,
      stripeId: subscription.id,
      cycleRecurrence: Recurrence.monthly,
      pickupsPerCycle: itemTotalQuantity,
      active: subscription.status === "active",
      createdAt: new Date(),
      updatedAt: new Date()
    } as Subscription
  });

  return updatedSubscription;
}
