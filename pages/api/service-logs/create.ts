import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../data/messaging";
import { completePickup } from "../../../lib/services/api/ApiScheduleService";
import { userCan } from "../../../lib/services/PermissionService";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.status(errorMessages.api.methodNotAllowed.code).json({ error: errorMessages.api.methodNotAllowed.message });
        return
    }

    const session: Session | null = await getSession({ req });

    if (!session?.user) {
        res.status(errorMessages.api.unauthorized.code).json({ error: errorMessages.api.unauthorized.message });
        return
    }


    if (!userCan(session?.user, ["service-logs:write"])) {
        res.status(403).json({ error: errorMessages.api.unauthorized.message });
        return
    }

    const serviceScheduleRouteId = req.body?.id as string;
    const notes = req.body.notes as string | null | undefined;

    if (!serviceScheduleRouteId) {
        res.status(400).json({ error: "ID is required" });
        return
    }

    // create service log here and mark pickup as completed
    const serviceLog = await completePickup(serviceScheduleRouteId, notes, new Date(), "pickup_recurring");
    
    res.status(200).json(serviceLog);
    return
}