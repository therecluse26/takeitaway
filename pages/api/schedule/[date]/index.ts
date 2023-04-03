import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../../data/messaging";
import { userCan } from "../../../../lib/services/PermissionService";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.status(errorMessages.api.methodNotAllowed.code).json({ error: errorMessages.api.methodNotAllowed.message });
        return
    }

    const session: Session | null = await getSession({ req });

    if (!session?.user) {
        res.status(errorMessages.api.unauthorized.code).json({ error: errorMessages.api.unauthorized.message });
        return
    }


    if (!userCan(session?.user, ["schedule:read"])) {
        res.status(403).json({ error: errorMessages.api.unauthorized.message });
        return
    }

    const date = req.query.date as string;

    res.status(200).json({});
        return
  
    }