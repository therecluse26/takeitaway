import { Session } from 'next-auth/core/types';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { errorMessages } from '../../../data/messaging';
import { getPaginatedProviders, getUnpaginatedProvidersCount } from '../../../lib/services/api/ApiProviderService';
import { buildFindManyParams, buildPaginatedData } from '../../../lib/services/DataTableService';
import { userCan } from '../../../lib/services/PermissionService';

export default async function getProviders(req: NextApiRequest, res: NextApiResponse)
{
    if(req.method !== 'GET'){
        res.status(errorMessages.api.methodNotAllowed.code).json({error: errorMessages.api.methodNotAllowed.message});
        return
    }
    
    const session: Session | null = await getSession({ req });
    
    if (!userCan(session?.user, ["admin:config"])) {
        res.status(403).json({error: errorMessages.api.unauthorized.message});
        return
    }

    const [paginatedQuery, unpaginatedQuery] = buildFindManyParams(req)

    res.status(200).json(
        buildPaginatedData(
            req,
            await getPaginatedProviders(paginatedQuery),
            await getUnpaginatedProvidersCount(unpaginatedQuery)
        )
    );
}
