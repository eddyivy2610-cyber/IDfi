import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { connectDB } from "@/src/lib/mongodb";
import { ObjectId } from "mongodb";
const JWT_SECRET = process.env.JWT_SECRET!;

// async function connectDB() {
//   if (mongoose.connection.readyState !== 1) {
//     await mongoose.connect(MONGODB_URI);
//   }
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
const {db} = await connectDB();
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    const User = db.collection("users");

    const user = await User.findOne({_id: new ObjectId(decoded.userId)})

    if (req.method === "GET") {
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }

    const Complaint = db.collection("complaints");
const User = db.collection("users");

const complaints = await Complaint.find().toArray();

const formattedComplaints = await Promise.all(
  complaints.map(async (c) => {
    const user = await User.findOne({ _id: new ObjectId(c.studentId as string) });
    return {
      id: c._id.toString(),
      studentName: user?.fullName || "Unknown",
      text: c.text,
      date: c.createdAt,
    };
  })
);

return res.status(200).json(formattedComplaints);
    }
    if (req.method === "POST") {
      if (decoded.role !== "student") {
        return res.status(403).json({ message: "Forbidden: Student access required" });
      }
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Complaint text required" });
      }
      const Complaint = db.collection("complaints");
      const complaint = {
        studentId: decoded.userId,
        text,
        createdAt: new Date(),
      };
      await Complaint.insertOne(complaint);
      return res.status(201).json({ message: "Complaint submitted" });
    }


    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}