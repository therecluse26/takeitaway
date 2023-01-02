import { PrismaClient } from "@prisma/client";
import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../../../data/messaging";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
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

    const paymentMethods = await prisma.userPaymentMethod.findMany({
        where: {
            userId: userId
        }
    });

    res.status(200).json(paymentMethods);
}