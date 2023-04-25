import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../data/messaging";
import { getScheduleForDate } from "../../../lib/services/api/ApiScheduleService";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.status(errorMessages.api.methodNotAllowed.code).json({ error: errorMessages.api.methodNotAllowed.message });
        return
    }

    const key = req.query.key as string;

    if (!key) {
        res.status(errorMessages.api.unauthorized.code).json({ error: errorMessages.api.unauthorized.message });
        return
    }

    const schedule = await getScheduleForDate(new Date(), true);

    res.status(200).json(schedule);
    return
}