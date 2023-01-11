import { Message, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function createMessage(message: Message): Promise<any> {
  return await prisma.message.create({
    data: message
  });
}