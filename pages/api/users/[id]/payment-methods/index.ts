import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../../../data/messaging";
import { getPaymentMethodsForUser } from "../../../../../lib/services/api/ApiUserService";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if(req.method !== 'GET'){
        res.status(errorMessages.api.methodNotAllowed.code).json({error: errorMessages.api.methodNotAllowed.message});
        return
    }

    const session: Session | null = await getSession({ req });
    if(!session?.user){
        res.status(errorMessages.api.unauthorized.code).json({error: errorMessages.api.unauthorized.message});
        return
    }

    const userId = req.query.id as string;
    if(!userId){
        res.status(404).json({error: errorMessages.api.notFound.message});
        return
    }

    const paymentMethods = await getPaymentMethodsForUser(session.user)

    res.status(200).json(paymentMethods);
}