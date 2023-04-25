import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../data/messaging";
import { generateNextBillingCycle } from "../../../lib/services/api/ApiBillingCycleService";
import { getAllActiveSubscriptions } from "../../../lib/services/api/ApiSubscriptionService";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        res.status(errorMessages.api.methodNotAllowed.code).json({ error: errorMessages.api.methodNotAllowed.message });
        return
    }

    const key = req.query.key as string;

    if (!key || key !== process.env.CRON_API_KEY) {
        res.status(errorMessages.api.unauthorized.code).json({ error: errorMessages.api.unauthorized.message });
        return
    }

    let generatedIds: string[] = [];
    let errors = [];

    const subscriptions = await getAllActiveSubscriptions();

    for (const subscription of subscriptions) {
        try {
            const generated = await generateNextBillingCycle(subscription);
            if (generated?.id !== undefined && generated?.id !== null) {
                generatedIds = [...generatedIds, generated.id];
            }

        } catch (err) {
            errors.push(err);
        }

    }

    res.status(200).json({ success: errors.length === 0 ? true : false, newBillingCycles: generatedIds, errors: errors });
    return
}