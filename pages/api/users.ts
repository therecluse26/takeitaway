import { PrismaClient } from '@prisma/client'
import { Session } from 'next-auth/core/types';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { errorMessages } from '../../data/messaging';
import { buildFindManyParams, buildPaginatedData } from '../../lib/services/DataTableService';
import { userCan } from '../../lib/services/PermissionService';

const prisma = new PrismaClient()

export default async function getUsers(req: NextApiRequest, res: NextApiResponse)
{
    const session: Session | null = await getSession({ req });
    
    if (!userCan(session?.user, ["users:read"])) {
        res.status(403).json({error: errorMessages.api.unauthorized.message});
        return
    }

    res.status(200).json(
        buildPaginatedData(
            await prisma.user.findMany(
                buildFindManyParams(req)
            ),
            req,
            await prisma.user.count()
        )
    );
}
