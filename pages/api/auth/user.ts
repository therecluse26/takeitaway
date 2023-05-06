// User API
import {Session} from "next-auth/core/types";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next/types";
import { getUserWithRelations } from "../../../lib/services/api/ApiUserService";

// Returns the user object if the user is authenticated
// Otherwise, returns null
export default async function user(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const session: Session | null = await getSession({ req });

    if(req.query.withRelations === 'true') {
        const user = await getUserWithRelations(session?.user?.id as string);
        res.status(200).json(user)
        return
    }

    if (session) {
        res.status(200).json(session.user);
    } else {
        res.status(200).json(null);
    }
}