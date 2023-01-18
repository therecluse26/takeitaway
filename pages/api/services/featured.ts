import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient()

export default async function getFeaturedServices(req: NextApiRequest, res: NextApiResponse){
    res.status(200).json(
        await prisma.service.findMany({
            where: {
                featured: true,
                displayed: true
            },
        })
    );
    
}