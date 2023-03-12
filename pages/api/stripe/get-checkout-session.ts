import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../data/messaging";
import { getCheckoutSession, getUserStripeId } from "../../../lib/services/api/ApiStripeService";
import {Stripe} from "stripe";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session: Session | null = await getSession({ req });

    if(!session?.user){
        res.status(403).json({error: errorMessages.api.unauthorized.message});
        return
    }

    const stripeUser = await getUserStripeId(session.user)

    if(!stripeUser){
        res.status(errorMessages.stripe.noCustomer.code).json({error: errorMessages.stripe.noCustomer.message});
        return
    }

    getCheckoutSession(stripeUser, req.body as Stripe.Checkout.SessionCreateParams)
    .then((session) => {
        res.status(200).json(session);
    })
    .catch((err: any) => {
        res.status(500).json({error: err?.message});
        return
    });

}