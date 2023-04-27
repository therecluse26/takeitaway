import { NextApiRequest, NextApiResponse } from "next/types";
import { STRIPE_CONFIG } from "../../../data/configuration";
import { errorMessages } from "../../../data/messaging";
import { handleWebhook, stripe } from "../../../lib/services/api/ApiStripeService";
import { getRawBody } from "../../../lib/utils/api-helpers";

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.status(errorMessages.api.methodNotAllowed.code).json({ error: errorMessages.api.methodNotAllowed.message });
        return
    }

    let rawBody = await getRawBody(req);
    const signature = req.headers['stripe-signature'] as any;
    if (STRIPE_CONFIG.stripeWebhookSigningSecret) {

        try {
            const event = stripe.webhooks.constructEvent(
                rawBody,
                signature,
                STRIPE_CONFIG.stripeWebhookSigningSecret
            );

            const response = await handleWebhook(event);

            res.status(200).json(response);
            return;

        } catch (err: any) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            res.status(403).json(err);
            return
        }

    }

    res.status(500).json("Failed to process webhook.");
    return
}