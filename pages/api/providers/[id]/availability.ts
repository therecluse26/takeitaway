import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from 'next-auth/core/types';
import { getSession } from "next-auth/react";
import { errorMessages } from "../../../../data/messaging";
import { userCan } from "../../../../lib/services/PermissionService";
import { updateAvailability } from "../../../../lib/services/api/ApiProviderService";

const prisma = new PrismaClient()

export default async function UpdateAvailability(req: NextApiRequest, res: NextApiResponse){

    if(req.method !== 'PUT' && req.method !== 'POST'){
        res.status(errorMessages.api.methodNotAllowed.code).json({error: errorMessages.api.methodNotAllowed.message});
        return
    }
    
    const id = req.query.id as string;
    if(!id){
        res.status(404).json({error: errorMessages.api.notFound.message});
        return
    }

    const session: Session | null = await getSession({ req });
    if (!userCan(session?.user, ["providers:write"]) && !(session?.user?.id === req.query.id)) {
        res.status(403).json({error: errorMessages.api.unauthorized.message});
        return
    }

    res.status(200).json(
        await updateAvailability(id, req.body)
    );
}
