import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/src/lib/mongodb";

export default async function (req: NextApiRequest, res:NextApiResponse) {
try {
     if (req.method === "GET") {    const { id } = req.query;

    const { db } = await connectDB();
    const users = await db.collection("users").find().toArray();
    const profiles = await db.collection("profiles").find().toArray();

    const result = users.map(u => {
      const p = profiles.find(p => p.userId === u._id.toString() || p.userId === u._id) || ({} as any);
      return {
        ...p,
        email: u.email,
        role: u.role,
        userId: u._id.toString(),
        createdAt: u.createdAt || p.createdAt
      };
    });

    return res.status(200).json(result);
}
} catch (error) {
    console.log(error)
    return res.status(500).json({message: "Internal Server Error"})
}
}