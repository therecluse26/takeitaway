import { Session } from 'next-auth/core/types';
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { errorMessages } from "../../../../data/messaging";
import { userCan } from "../../../../lib/services/PermissionService";
import { deleteAddress, getAddress } from "../../../../lib/services/api/ApiAddressService";

export default async function GetAddress(req: NextApiRequest, res: NextApiResponse) {

    const id = req.query.id as string;
    if (!id) {
        res.status(404).json({ error: errorMessages.api.notFound.message });
        return
    }

    const session: Session | null = await getSession({ req });

    if (req.method === 'GET') {

        if (!userCan(session?.user, ["users:read"])) {
            res.status(403).json({ error: errorMessages.api.unauthorized.message });
            return
        }

        res.status(200).json(
            await getAddress(id)
        );

    } else if (req.method === 'DELETE') {
        
        const address = await getAddress(id);
        
        if ( !userCan(session?.user, ["users:write"], address?.userId)) {
            res.status(403).json({ error: errorMessages.api.unauthorized.message });
            return
        }

        res.status(200).json(
            await deleteAddress(address)
        );

    }
 
}