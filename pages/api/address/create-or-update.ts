import { Address } from '@prisma/client'
import { Session } from 'next-auth/core/types';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next/types'
import { errorMessages } from '../../../data/messaging';
import { addressIsWithinServiceArea, createOrUpdateAddress, geocodeAddress, updateAddress, updateBillingAddress } from '../../../lib/services/api/ApiAddressService'
import { userCan } from '../../../lib/services/PermissionService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {

    if (req.method !== 'POST') {
      res.status(405).json({ error: errorMessages.api.methodNotAllowed.message })
    }

    const session: Session | null = await getSession({ req });

    if (!userCan(session?.user, ["users:write"])) {
      res.status(403).json({ error: errorMessages.api.unauthorized.message });
      return
  }

    if (!req.body) {
      res.status(400).json({ message: 'Bad request' })
    }

    let data =  {
      type: req.body.type,
      userId: req.body.userId,
      street: req.body.street,
      street2: req.body.street2,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      country: req.body.country,
    } as Address

    if(req.body.id){
      data.id = req.body.id;
    }


    const address = await createOrUpdateAddress(
      data
    )

    await geocodeAddress(address)

    if(await addressIsWithinServiceArea(address)){
      address.inServiceArea = true;
      updateAddress(address)
    }

    if(address.type === 'billing'){
      await updateBillingAddress(req.body.userId, address)
    }

    res.status(200).json(address)

  } catch (error: any) {
    console.error(error)
    res.status(500).json(error)
  }
 
}