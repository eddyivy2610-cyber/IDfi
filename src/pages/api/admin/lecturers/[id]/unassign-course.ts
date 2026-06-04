import Course from "@/src/lib/models/Course";
import { MongoClient, ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
export default async function (req: NextApiRequest, res: NextApiResponse) {
    const client = new MongoClient(process.env.MONGODB_URI)
    const db = client.db()
try {
     const { courseId } = req.body;
     const {id: lecturerId} = req.query;
     console.log(req.body, req.query)
      if (!lecturerId || !courseId) {
        await client.close();
        return res.status(400).json({ message: "Lecturer ID and Course ID required" });
      }

      const Lecturer = db.collection("lecturers");
      const lecturer = await Lecturer.findOne({_id: new ObjectId(lecturerId.toString())})
      if(!lecturer) return res.status(400).json({message: "lecturer not found!"})
        const newCourses = lecturer.courses.filter((c: ObjectId) => {
      if(c.toString() !== (courseId)) return new ObjectId(c);
      }) as ObjectId[];
      console.log(newCourses)
      const updated = await Lecturer.updateOne({_id: new ObjectId(lecturerId.toString())}, { $set: { courses: newCourses} });
      console.log(updated)
      await client.close();
      return res.status(200).json({message: "course unassigned"})
  } catch (error) {
    console.error("Error:", error);
    client.close();
    return res.status(500).json({ message: "Internal server error", error: error});
  }
}