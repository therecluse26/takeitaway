import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../data/messaging";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.status(errorMessages.api.methodNotAllowed.code).json({ error: errorMessages.api.methodNotAllowed.message });
        return
    }

    const key = req.query.key as string;

    if (!key || key !== process.env.CRON_API_KEY) {
        res.status(errorMessages.api.unauthorized.code).json({ error: errorMessages.api.unauthorized.message });
        return
    }


    res.status(200).json({});
    return
}