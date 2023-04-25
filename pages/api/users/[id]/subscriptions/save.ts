import { SubscriptionStatus } from "@prisma/client";
import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../../../data/messaging";
import { BillingCycleData, createBillingCycle } from "../../../../../lib/services/api/ApiBillingCycleService";
import { saveSubscriptionToUser, stripeSubscriptionExists } from "../../../../../lib/services/api/ApiSubscriptionService";
import { getSubscriptionsFromSession } from "../../../../../lib/services/StripeService";

function firstDayOfMonth(year: number, month: number): Date {
    return new Date(year, month, 1);
}

function lastdayOfMonth(year: number, month: number): Date {
    return new Date(year, month + 1, 0);
}

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

    const session_id = req.body?.session_id;

    let subscription = null;
    try {
        subscription = await getSubscriptionsFromSession(session_id.toString());
    } catch (error) {
        res.status(400).json({ error: error });
        return
    }

    if (subscription) {
        if (await stripeSubscriptionExists(subscription.id)) {
            res.status(400).json({ error: errorMessages.stripe.paymentMethodAlreadyExists.message });
            return
        }

        const savedSub = await saveSubscriptionToUser(subscription, session.user)

        const billingCycleData = {
            userId: session.user.id,
            subscriptionId: savedSub.id,
            startDate: firstDayOfMonth(new Date().getFullYear(), new Date().getMonth()),
            endDate: lastdayOfMonth(new Date().getFullYear(), new Date().getMonth()),
            amount: savedSub.amount ?? 0,
            active: savedSub.status === SubscriptionStatus.active ?? false,
            pickups: savedSub.pickupsPerCycle ?? 0,
        } as BillingCycleData

        await createBillingCycle(billingCycleData)

        res.status(200).json(savedSub);
            return
    }

        res.status(errorMessages.stripe.subscriptionNotFound.code).json({ error: errorMessages.stripe.subscriptionNotFound.message });
    }