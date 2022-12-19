import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from 'next-auth/core/types';
import { getSession } from "next-auth/react";
import { errorMessages } from "../../../../data/messaging";
import { userCan } from "../../../../lib/services/PermissionService";

const prisma = new PrismaClient()

export default async function GetUser(req: NextApiRequest, res: NextApiResponse){

    const session: Session | null = await getSession({ req });

    if (!userCan(session?.user, ["users:read"])) {
        res.status(403).json({error: errorMessages.api.unauthorized.message});
        return
    }

    const id = req.query.id as string;

    if(!id){
        res.status(403).json({error: errorMessages.api.notFound.message});
        return
    }

    res.status(200).json(
        await prisma.user.findUnique({
            where: {
                id: id
            }
        })
    );
}