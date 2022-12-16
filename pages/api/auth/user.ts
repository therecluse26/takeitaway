// User API
import {Session} from "next-auth/core/types";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";

// Returns the user object if the user is authenticated
// Otherwise, returns null
export default async function user(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session: Session | null = await getSession({ req });

    if (session) {
        res.status(200).json(session.user);
    } else {
        res.status(200).json(null);
    }
}