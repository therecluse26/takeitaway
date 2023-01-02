import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../../../data/messaging";
import { getPaymentMethodByStripeId, savePaymentMethodToUser } from "../../../../../lib/services/api/ApiUserService";
import { getPaymentMethodFromSession } from "../../../../../lib/services/StripeService";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session: Session | null = await getSession({ req });

    if(!session?.user){
        res.status(errorMessages.api.unauthorized.code).json({error: errorMessages.api.unauthorized.message});
        return
    }

    if(!req.query.session_id){
        res.status(errorMessages.api.stripe.noSessionId.code).json({error: errorMessages.api.stripe.noSessionId.message});
        return
    }

    let paymentMethod = null;
    try {
        paymentMethod = await getPaymentMethodFromSession(req.query.session_id.toString());
    } catch (error) {
        res.status(400).json({error: error});
        return
    }

    if(paymentMethod){
        if(await getPaymentMethodByStripeId(paymentMethod.id)){
            res.status(400).json({error: errorMessages.api.stripe.paymentMethodAlreadyExists.message});
            return
        }
        await savePaymentMethodToUser(paymentMethod, session.user)
    }

    res.status(200).json(paymentMethod);
}