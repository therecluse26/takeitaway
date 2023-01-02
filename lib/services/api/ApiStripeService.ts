import { PrismaClient } from "@prisma/client";

export async function getUserStripeId(user: any): Promise<string | null>{
    if(!user.stripeId){
        const prisma = new PrismaClient();
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const stripeUser = await stripe.customers.create({
            email: user.email,
            name: user.name
        });
        await prisma.user.update({
            where: {
                id: user.id,
                email: user.email
            },
            data: {
                stripeId: stripeUser.id.toString()
            }
        })
        return stripeUser.id.toString();
    }

    return user.stripeId;
}