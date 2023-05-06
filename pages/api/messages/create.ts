import { Message } from '@prisma/client'
import { withHCaptcha } from 'next-hcaptcha'
import { NextApiRequest, NextApiResponse } from 'next/types'
import captchaConfig from '../../../config/hcaptcha.config'
import { createMessage } from '../../../lib/services/api/ApiMessageService'

export default withHCaptcha((req: NextApiRequest, res: NextApiResponse) => {

  try {
    if (!req.body) {
      res.status(400).json({ message: 'Bad request' })
    }
    const message = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      phone: req.body.phone || null,
      city: req.body.city || null,
    } as Message
  
    createMessage(message)

    res.status(200).json({ message: 'Message created' })

  } catch (error: any) {
    res.status(500).json(error)
  }
 
}, captchaConfig)