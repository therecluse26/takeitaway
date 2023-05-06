import { Session } from 'next-auth/core/types';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next/types'
import { errorMessages } from '../../../../data/messaging';
import { resourceBelongsToUser, userCan } from '../../../../lib/services/PermissionService';
import { getAddress, saveAddressInstructions } from '../../../../lib/services/api/ApiAddressService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {

    if (req.method !== 'POST' && req.method !== 'PUT') {
      res.status(405).json({ error: errorMessages.api.methodNotAllowed.message })
    }

    const session: Session | null = await getSession({ req });

    const address = await getAddress(req.query.id as string)

    if(!address){
        res.status(404).json({ error: errorMessages.api.notFound.message })
    }

    if (!resourceBelongsToUser(address, session?.user) && !userCan(session?.user, ["users:write"])) {
      res.status(403).json({ error: errorMessages.api.unauthorized.message });
      return
  }

    if (!req.body) {
      res.status(400).json({ message: 'Bad request' })
    }

    saveAddressInstructions(address.id as string, req.body.instructions)

    res.status(200).json({success: true})

  } catch (error: any) {
    console.error(error)
    res.status(500).json(error)
  }
 
}