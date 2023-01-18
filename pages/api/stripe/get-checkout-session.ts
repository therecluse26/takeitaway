import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../data/messaging";
import { getCheckoutSession, getUserStripeId } from "../../../lib/services/api/ApiStripeService";

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
        res.status(errorMessages.api.stripe.noCustomer.code).json({error: errorMessages.api.stripe.noCustomer.message});
        return
    }

    const stripeSession = getCheckoutSession(stripeUser, req.body.sessionMode, req.body.successUrl, req.body.cancelUrl)

    res.status(200).json(stripeSession);
}