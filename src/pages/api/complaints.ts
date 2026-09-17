import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { connectDB } from "@/src/lib/mongodb";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectDB();
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    const User = db.collection("users");
    const user = await User.findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return res.status(404).json({ message: "User account not found" });
    }

    const Complaint = db.collection("complaints");

    // GET: Fetch complaints
    if (req.method === "GET") {
      if (user.role === "admin") {
        // Admin gets all complaints
        const complaints = await Complaint.find().sort({ createdAt: -1 }).toArray();
        const formattedComplaints = await Promise.all(
          complaints.map(async (c) => {
            const studentUser = await User.findOne({ _id: new ObjectId(c.studentId as string) });
            return {
              id: c._id.toString(),
              studentId: c.studentId,
              studentName: c.studentName || studentUser?.full_name || studentUser?.fullName || "Student",
              email: c.email || studentUser?.email || "N/A",
              subject: c.subject || "General Inquiry",
              category: c.category || "General",
              text: c.text,
              status: c.status || "open",
              date: c.createdAt,
            };
          })
        );
        return res.status(200).json(formattedComplaints);
      } else {
        // Student gets their own logged complaints
        const complaints = await Complaint.find({
          $or: [
            { studentId: decoded.userId },
            { studentId: new ObjectId(decoded.userId) },
            { email: user.email }
          ]
        }).sort({ createdAt: -1 }).toArray();

        const formatted = complaints.map((c) => ({
          id: c._id.toString(),
          studentName: c.studentName || user.full_name || "Student",
          email: c.email || user.email,
          subject: c.subject || "General Inquiry",
          category: c.category || "General",
          text: c.text,
          status: c.status || "open",
          date: c.createdAt,
        }));

        return res.status(200).json(formatted);
      }
    }

    // POST: Log a new complaint/issue
    if (req.method === "POST") {
      const { email, text, subject, category } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ message: "Complaint detail is required" });
      }

      const complaintDoc = {
        studentId: decoded.userId,
        studentName: user.full_name || user.fullName || "Student",
        email: email ? email.trim() : user.email,
        subject: subject ? subject.trim() : "ID Card / Account Inquiry",
        category: category || "General",
        text: text.trim(),
        status: "open",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await Complaint.insertOne(complaintDoc);

      return res.status(201).json({
        message: "Complaint logged successfully. Our support team will review it shortly.",
        complaint: {
          id: result.insertedId.toString(),
          ...complaintDoc,
        },
      });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error in /api/complaints:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}