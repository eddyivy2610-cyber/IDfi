import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/src/lib/mongodb";

export default async function (req: NextApiRequest, res:NextApiResponse) {
try {
     if (req.method === "GET") {    const { id } = req.query;

    const { db } = await connectDB();
    const result = await db.collection("students").find().toArray();

    return res.status(200).json(result)
}
} catch (error) {
    console.log(error)
    return res.status(500).json({message: "Internal Server Error"})
}
}