import { Address } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { createAddress } from '../../../lib/services/api/ApiAddressService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  try {
    if (!req.body) {
      res.status(400).json({ message: 'Bad request' })
    }
    
    const address = await createAddress(
      {
        type: req.body.type,
        userId: req.body.userId,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        country: req.body.country,
      } as Address
    )

    res.status(200).json(address)

  } catch (error: any) {
    res.status(500).json(error)
  }
 
}