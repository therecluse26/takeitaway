import { NextApiRequest, NextApiResponse } from "next";
import { getFeaturedServices } from "../../../lib/services/api/ApiServiceService";

export default async function getFeatured(req: NextApiRequest, res: NextApiResponse){
    res.status(200).json(
       await getFeaturedServices()
    );
    
}