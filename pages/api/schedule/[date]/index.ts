import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../../data/messaging";
import { getScheduleForDate } from "../../../../lib/services/api/ApiScheduleService";
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

    const dateString = req.query.date as string;

    if (!dateString) {
        res.status(400).json({ error: "Date is required" });
        return
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        res.status(400).json({ error: "Date is invalid" });
        return
    }

    const schedule = await getScheduleForDate(date, req.query.regenerate === "true");
    
    res.status(200).json(schedule);
        return
    }