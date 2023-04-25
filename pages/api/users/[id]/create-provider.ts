import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from 'next-auth/core/types';
import { getSession } from "next-auth/react";
import { errorMessages } from "../../../../data/messaging";
import { createProviderFromUser } from "../../../../lib/services/api/ApiProviderService";
import { getUser } from "../../../../lib/services/api/ApiUserService";
import { userCan } from "../../../../lib/services/PermissionService";

export default async function DeleteUser(req: NextApiRequest, res: NextApiResponse){

    if(req.method !== 'POST'){
        res.status(errorMessages.api.methodNotAllowed.code).json({error: errorMessages.api.methodNotAllowed.message});
        return
    }
    
    const id = req.query.id as string;
    if(!id){
        res.status(404).json({error: errorMessages.api.notFound.message});
        return
    }

    const session: Session | null = await getSession({ req });
    if (!userCan(session?.user, ["users:write"]) && !(session?.user?.id === req.query.id)) {
        res.status(403).json({error: errorMessages.api.unauthorized.message});
        return
    }

    const user = await getUser(id);

    if(user){
        res.status(200).json(
            await createProviderFromUser(user as User)
        );
        return;
    }

    res.status(404).json({error: errorMessages.api.notFound.message});
    return
  
}
