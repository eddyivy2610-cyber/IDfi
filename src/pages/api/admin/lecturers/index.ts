import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/src/lib/mongodb";
import { verify_token } from "@/src/middleware/auth";

interface Lecturer {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  assignedCourses: string[];
  createdAt: string;
  updatedAt: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await connectDB();

    // Verify token and check admin role
    const user = await verify_token(req, res);

    console.log(user)
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin role required." });
    }

    if (req.method === "GET") {
    console.log(req.method)

      // Get all lecturers
      const lecturers: Lecturer[] = await db.collection("lecturers").find({}).toArray();
      return res.status(200).json(lecturers);
    }

    if (req.method === "POST") {
      const { name, email, phone, department } = req.body as Omit<Lecturer, "assignedCourses" | "createdAt" | "updatedAt">;

      if (!name || !email || !phone || !department) {
        return res.status(400).json({ message: "Missing required fields: name, email, phone, department" });
      }

      // Check if lecturer already exists
      const existingLecturer = await db.collection("lecturers").findOne({ email });
      if (existingLecturer) {
        return res.status(400).json({ message: "Lecturer with this email already exists" });
      }

      const newLecturer: Lecturer = {
        name,
        email,
        phone,
        department,
        assignedCourses: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = await db.collection("lecturers").insertOne(newLecturer);
      const lecturer = await db.collection("lecturers").findOne({ _id: result.insertedId });

      return res.status(201).json(lecturer);
    }

    // *************************************************

    const lecturerId = ""

    if (req.method === "PUT") {
      const { name, email, phone, department } = req.body;

      if (!name || !email || !phone || !department) {
        return res.status(400).json({ message: "Missing required fields: name, email, phone, department" });
      }

      const existingLecturer = await db.collection("lecturers").findOne({ email, _id: { $ne: lecturerId } });
      if (existingLecturer) {
        return res.status(400).json({ message: "Another lecturer with this email already exists" });
      }

      const updateData = { name, email, phone, department, updatedAt: new Date().toISOString() };

      const result = await db.collection("lecturers").updateOne({ _id: lecturerId }, { $set: updateData });
      if (result.matchedCount === 0) return res.status(404).json({ message: "Lecturer not found" });

      const updatedLecturer = await db.collection("lecturers").findOne({ _id: lecturerId });
      return res.status(200).json(updatedLecturer);
    }

    if (req.method === "DELETE") {
      const result = await db.collection("lecturers").deleteOne({ _id: lecturerId });
      if (result.deletedCount === 0) return res.status(404).json({ message: "Lecturer not found" });

      await db.collection("courses").updateMany({ lecturerId: lecturerId.toString() }, { $unset: { lecturerId: "" } });

      return res.status(200).json({ message: "Lecturer deleted successfully" });
    }

    console.log("lecturers")

 // ***************************************

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Lecturers API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
