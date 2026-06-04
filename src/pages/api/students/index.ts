// import { NextApiRequest, NextApiResponse } from "next";
// import { connectDB } from "@/src/lib/mongodb";
// import { verify_token } from "@/src/middleware/auth";
// import { Student } from "@/src/lib/models/Student";
// import { ObjectId } from "mongodb";

// export default async function (req: NextApiRequest, res:NextApiResponse) {
//      await connectDB();

//      console.log(req.method)
        
//         const user = verify_token(req, res);
//         if (!user) return;
    
//         const { db } = await connectDB();
//         try {
//             if(req.method === "POST") {
                
//             const { userId } = req.body;

//            const Student = db.collection("students")

//            const existing = await Student.findOne({userId: userId});

//            if(existing) return res.status(302).json({error: false, message: "student verified!"});

//            const Profile = db.collection("profiles");

//            const profile = await Profile.findOne({userId})

//            if(!profile) return res.status(400).json({error: true, message: "complete your profile to complete your registration"})

//            const newStudent: Student = {
//                 userId: userId,
//                 courses: [],
//                 yearOfStudy: profile.study_year,
//                 enrollmentNumber:  String(Profile.countDocuments.length + 100),
//                 totalCreditsEnrolled: 0,
//                 createdAt: new Date(),
//                 programme: profile.programme,
//                 maxCreditsAllowed: 48,
//                 profileCompleted: false
//            }

//            const created = await Student.insertOne(newStudent);

//            console.log(created)

//            if(!created.insertedId) return res.status(400).json({error: true, message: "student not enrolled"})

//            return res.status(201).json({error: false, message: "student registered."})
        
//         }
        
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({error: true, message: error.statusText})
//     }

//     return res.status(400).json({error: true, message: "method not allowed!"})
// }

// pages/api/students/register.ts
import { connectDB } from '@/src/lib/mongodb';
import { verify_token } from '@/src/middleware/auth';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const { db } = await connectDB();
    const user = await verify_token(req, res);

    if(user.role === "admin") return res.status(200).json({message: "admin"})

    const { programme, yearOfStudy } = req.body;
    const existing = await db.collection('students').findOne({ userId: new ObjectId(user.userId as string) });
    if (existing) return res.status(200).json({ message: 'Student already registered' });

    const profileCount = await db.collection('students').countDocuments();
    const enrollmentNumber = String(profileCount + 100);

    const profile = await db.collection("profiles").find().toArray();

    console.log(profile)

    if(!profile) return res.status(400).json({message: "complete your student profile!"})

    await db.collection('students').insertOne({
      userId: new ObjectId(user.userId as string),
      name: profile.full_name,
      email: profile.email,
      program: profile.program,
      yearOfStudy: profile.study_year,
      enrollmentNumber,
      courses: []
    });

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    console.error('Student registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
