import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/src/lib/mongodb";
import { verify_token } from "@/src/middleware/auth";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await connectDB();
    const { id } = req.query;

    // Verify token and check admin role
    const user = await verify_token(req, res);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin role required." });
    }

    if (!ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid lecturer ID" });
    }

    const lecturerId = new ObjectId(id as string);
    const {courseId} = req.body;

    
    if (req.method === "POST") {
      const lecturer = await db.collection("lecturers").findOne({ _id: lecturerId  });
      console.log(lecturer)
  if (!lecturer) return res.status(404).json({ message: "Lecturer not found" });

  if(await lecturer.assignedCourses.find(c => c.toString() === courseId)) return res.status(400).json({message: "course assigned to lecturer already"})

  const course = await db.collection("courses").findOne({ _id: new ObjectId(courseId as string) });
  if (!course) return res.status(404).json({ message: "Course not found!" });

  await db.collection("lecturers").updateOne(
    { _id: new ObjectId(lecturerId) },
    { $push: { courses: courseId } }
  );

  return res.status(200).json({ message: "Lecturer assigned to course" });
}

   
    if (req.method === "GET") {
      const lecturer = await db.collection("lecturers").findOne({ _id: lecturerId });
      if (!lecturer) return res.status(404).json({ message: "Lecturer not found" });
      return res.status(200).json(lecturer);
    }

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

    console.log(req.method)

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Lecturer API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
