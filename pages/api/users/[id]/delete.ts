import { NextApiRequest, NextApiResponse } from "next";
import { Session } from 'next-auth/core/types';
import { getSession } from "next-auth/react";
import { errorMessages } from "../../../../data/messaging";
import { userCan } from "../../../../lib/services/PermissionService";
import prisma from "../../../../lib/prismadb";

export default async function DeleteUser(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'DELETE') {
        res.status(errorMessages.api.methodNotAllowed.code).json({ error: errorMessages.api.methodNotAllowed.message });
        return
    }

    const id = req.query.id as string;
    if (!id) {
        res.status(404).json({ error: errorMessages.api.notFound.message });
        return
    }

    const session: Session | null = await getSession({ req });
    if (!userCan(session?.user, ["users:delete"]) && !(session?.user?.id === req.query.id)) {
        res.status(403).json({ error: errorMessages.api.unauthorized.message });
        return
    }

    res.status(200).json(
        await prisma.user.delete({
            where: {
                id: id
            },
        })
    );
}
