import { Session } from "next-auth/core/types";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { errorMessages } from "../../../../../data/messaging";
import { saveUserPickupPreferences } from "../../../../../lib/services/api/ApiUserService";


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

    try {
        const pickupPreferences = req.body?.pickupPreferences;
    
        res.status(200).json(
            await saveUserPickupPreferences(session.user.id, pickupPreferences)
            );
    } catch (error) {
        res.status(400).json({ error: error });
    }
  

}

