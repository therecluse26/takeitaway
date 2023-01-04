import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../../../../data/messaging";
import { getPaymentMethodById, setPaymentMethodAsDefault } from "../../../../../../lib/services/api/ApiUserService";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if(req.method !== 'POST'){
        res.status(errorMessages.api.methodNotAllowed.code).json({error: errorMessages.api.methodNotAllowed.message});
        return
    }
    const session: Session | null = await getSession({ req });
    if(!session?.user){
        res.status(errorMessages.api.unauthorized.code).json({error: errorMessages.api.unauthorized.message});
        return
    }
    const userId = req.query.id as string;
    const paymentMethodId = req.query.payment_method_id as string;
    if(!userId || !paymentMethodId){
        res.status(404).json({error: errorMessages.api.notFound.message});
        return
    }

    const paymentMethod = await getPaymentMethodById(paymentMethodId)
    if(!paymentMethod){
        res.status(404).json({error: errorMessages.api.notFound.message});
        return
    }

    const response = await setPaymentMethodAsDefault(paymentMethod)

    res.status(200).json(response);

    
}