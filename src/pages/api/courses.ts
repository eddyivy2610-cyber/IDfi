import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { connectDB } from "@/src/lib/mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

// async function connectDB() {
//   if (mongoose.connection.readyState !== 1) {
//     await mongoose.connect(MONGODB_URI);
//   }
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // await connectDB();

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    
    const {db} = await connectDB()
    const User = db.collection("users");

    const user = await User.findOne({_id: new ObjectId(decoded.userId)})
    
    // if (user.role !== "admin") {
    //   return res.status(403).json({ message: "Forbidden: Admin access required" });
    // }
    
    if (req.method === "GET") {
      const Course = db.collection("courses");
      const courses = await Course.find().toArray();
      return res.status(200).json(courses);
    }

    if (req.method === "POST") {
      const { code, name, semester, creditUnits, year, program } = req.body;
      if (!code || !name || !semester || !year || !program || !creditUnits) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const Course = db.collection("courses");

      const newCourse = {
        code,
        name,
        semester,
        year,
        creditUnits,
        program,
        createdAt: new Date(),
      };
      const savedCourse = await Course.insertOne(newCourse);

      if(!savedCourse.acknowledged) return res.status(500).json({course: null})

      const course = await Course.findOne({_id: savedCourse.insertedId})

      return res.status(201).json(course);
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: "Course ID required" });
      }
      const Course = db.collection("courses");
      const result = await Course.deleteOne({_id: new ObjectId(id.toString())});
      if (!result) {
        return res.status(404).json({ message: "Course not found" });
      }
      return res.status(200).json({ message: "Course deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}