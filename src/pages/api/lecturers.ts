import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

// async function connectDB() {
//   if (mongoose.connection.readyState !== 1) {
//     await mongoose.connect(MONGODB_URI);
//   }
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 const client = new MongoClient(process.env.MONGODB_URI)
 await client.connect();
 const db = client.db();

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
       await client.close();
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    const Users = db.collection("users");
    const user = await Users.findOne({_id: new ObjectId(decoded.userId)})
    // if (user.role !== "admin") {
    //     await client.close()
    //   return res.status(403).json({ message: "Forbidden: Admin access required" });
    // }

    if (req.method === "GET") {
        const Lecturer = db.collection("lecturers");
      const lecturers = await Lecturer.find().toArray();
      await client.close();
      console.log(lecturers)
      return res.status(200).json(lecturers);
    }

    if (req.method === "POST") {
      const { department, name, email, phone } = req.body;
      if (!name || !department || !email || !phone) {
       await client.close();

        return res.status(400).json({ message: "Missing required fields" });
      }

      const Lecturer = db.collection("lecturers");
      const lecturer =  {
        _id: new ObjectId(),
        department,
        name,
        email,
        createdAt: new Date(),
      };
      await Lecturer.insertOne(lecturer);
        await client.close()
      return res.status(201).json(lecturer);
    }

    if (req.method === "PUT") {
      const { id, courseId } = req.body;
      if (!id || !courseId) {
        await client.close();
        return res.status(400).json({ message: "Lecturer ID and Course ID required" });
      }

      const Course = db.collection("courses");
      const updated = await Course.findOneAndUpdate(courseId, { lecturerId: id });
      await client.close();
      return res.status(200).json({ message: "Course assigned to lecturer", course: updated });
    }
    await client.close();
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error);
    client.close();
    return res.status(500).json({ message: "Internal server error", error: error});
  }
}