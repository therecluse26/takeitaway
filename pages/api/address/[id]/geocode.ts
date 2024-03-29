import { Session } from 'next-auth/core/types';
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { errorMessages } from "../../../../data/messaging";
import { userCan } from "../../../../lib/services/PermissionService";
import { geocodeAddress } from "../../../../lib/services/api/ApiAddressService";
import prisma from "../../../../lib/prismadb";

export default async function GeocodeAddress(req: NextApiRequest, res: NextApiResponse) {

    const id = req.query.id as string;

    if (!id) {
        res.status(404).json({ error: errorMessages.api.notFound.message });
        return
    }

    let address = await prisma.address.findUnique({
        where: {
            id: id
        },
    })

    const session: Session | null = await getSession({ req });
    if (!userCan(session?.user, ["users:write"])) {
        if (!(address?.userId === session?.user?.id)) {
            res.status(403).json({ error: errorMessages.api.unauthorized.message });
            return
        }
    }

    address = await geocodeAddress(id)

    res.status(200).json(
        address
    );

}