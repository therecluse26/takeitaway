import { PrismaClient } from '@prisma/client'
import { Session } from 'next-auth/core/types';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { errorMessages } from '../../../data/messaging';
import { buildFindManyParams, buildPaginatedData } from '../../../lib/services/DataTableService';
import { userCan } from '../../../lib/services/PermissionService';

const prisma = new PrismaClient()

export default async function getUsers(req: NextApiRequest, res: NextApiResponse)
{
    const session: Session | null = await getSession({ req });
    
    if (!userCan(session?.user, ["users:read"])) {
        res.status(403).json({error: errorMessages.api.unauthorized.message});
        return
    }

    const [paginatedQuery, unpaginatedQuery] = buildFindManyParams(req)

    const userCount = await prisma.user.count(unpaginatedQuery);

    const userResults = await prisma.user.findMany(
        {
            ...paginatedQuery,
            include: {
                _count: {
                    select: {
                        addresses: true,
                        subscriptions: true,
                    }
                }
            }
        }
    );

    res.status(200).json(
        buildPaginatedData(
            req,
            userResults,
            userCount
        )
    );
}
