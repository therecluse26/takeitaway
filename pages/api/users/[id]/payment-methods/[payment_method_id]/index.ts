import { PrismaClient } from "@prisma/client";
import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../../../../data/messaging";

const prisma = new PrismaClient();

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

    const id = req.query.payment_method_id as string;
    if(!id){
        res.status(404).json({error: errorMessages.api.notFound.message});
        return
    }

    const paymentMethod = await prisma.paymentMethod.findUnique({
        where: {
            id: id
        }
    });

    res.status(200).json(paymentMethod);
}