import { connectDB } from "@/src/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    if (!id || !ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const { db } = await connectDB();

    const updateData = req.body;

    const result = await db.collection("students").updateOne(
      { userId: new ObjectId(id as string) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const updatedStudent = await db.collection("students").findOne({ userId: new ObjectId(id as string) });

    console.log(updatedStudent)

    res.status(200).json(updatedStudent);
  } catch (err: any) {
    console.error("Update student error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
