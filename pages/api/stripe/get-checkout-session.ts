import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../data/messaging";
import { getUserStripeId } from "../../../lib/services/api/ApiStripeService";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session: Session | null = await getSession({ req });
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    if(!session?.user){
        res.status(403).json({error: errorMessages.api.unauthorized.message});
        return
    }

    const sessionMode = req.body.sessionMode;
    const successUrl = req.body.successUrl;
    const cancelUrl = req.body.cancelUrl;

    const stripeUser = await getUserStripeId(session.user)

    if(!stripeUser){
        res.status(errorMessages.api.stripe.noCustomer.code).json({error: errorMessages.api.stripe.noCustomer.message});
        return
    }

    const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: sessionMode,
        customer: stripeUser,
        success_url: successUrl,
        cancel_url: cancelUrl,
    })

    res.status(200).json(stripeSession);
}