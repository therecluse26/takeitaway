import { Message } from "@prisma/client";
import prisma from "../../prismadb";

export async function createMessage(message: Message): Promise<any> {
  return await prisma.message.create({
    data: message
  });
}