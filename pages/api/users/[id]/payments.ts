import { NextApiRequest, NextApiResponse } from "next";
import { Session } from 'next-auth/core/types';
import { getSession } from "next-auth/react";
import { errorMessages } from "../../../../data/messaging";
import { userCan } from "../../../../lib/services/PermissionService";
import prisma from "../../../../lib/prismadb";

export default async function GetUserPayments(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'GET') {
        res.status(errorMessages.api.methodNotAllowed.code).json({ error: errorMessages.api.methodNotAllowed.message });
        return
    }

    const session: Session | null = await getSession({ req });

    if (!userCan(session?.user, ["users:read"])) {
        res.status(403).json({ error: errorMessages.api.unauthorized.message });
        return
    }

    const id = req.query.id as string;

    if (!id) {
        res.status(403).json({ error: errorMessages.api.notFound.message });
        return
    }

    res.status(200).json(
        await prisma.payment.findMany({
            where: {
                userId: id,
                status: 'complete'
            },
        })
    );
}
