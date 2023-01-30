import { Address } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { notifyError } from '../../../helpers/notify'
import { createOrUpdateAddress, updateBillingAddress } from '../../../lib/services/api/ApiAddressService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  try {
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

    if(address.type === 'billing'){
      await updateBillingAddress(req.body.userId, address)
    }

    res.status(200).json(address)

  } catch (error: any) {
    console.error(error)
    res.status(500).json(error)
  }
 
}