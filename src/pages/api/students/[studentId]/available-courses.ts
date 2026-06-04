// // pages/api/students/[studentId]/available-courses.js
// import { connectDB } from '@/src/lib/mongodb';
// import { verify_token } from '@/src/middleware/auth';
// import { ObjectId } from 'mongodb';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function (req: NextApiRequest, res: NextApiResponse) {
//   try {
//     await connectDB();
    
//     const user = verify_token(req, res);
//     if (!user) return;

//     const { studentId } = req.query;
//     const { db } = await connectDB();

//     if (!ObjectId.isValid(studentId.toString())) {
//       return res.status(400).json({ message: 'Invalid student ID' });
//     }

//     if (req.method === 'GET') {
//       // Get student details
//       const student = await db.collection('students').findOne({ 
//         studentId: studentId 
//       });

//       if (!student) {
//         return res.status(404).json({ message: 'Student not found' });
//       }

//       //Check if user can access this student's data
//       if (user.role === 'student' && user.id !== studentId) {
//         return res.status(403).json({ message: 'Access denied' });
//       }

//       // Get available courses based on student's program and year
//       const availableCourses = await db.collection('courses').find({
//         // program: student.programme,
//         year: { $lte: student.yearOfStudy }, // Only courses for current or lower years
//         isActive: true,
//         _id: { $nin: student.courses?.map(id => new ObjectId(id)) || [] } // Exclude enrolled courses
//       }).toArray();

//       // Add enrollment information to each course
//       const coursesWithEnrollment = await Promise.all(
//         availableCourses.map(async (course) => {
//           const enrollmentCount = await db.collection('enrollments').countDocuments({
//             courseId: course._id,
//             status: 'enrolled'
//           });

//           return {
//             ...course,
//             currentEnrollment: enrollmentCount,
//             canEnroll: enrollmentCount < (course.maxEnrollment || 50),
//             spotsRemaining: (course.maxEnrollment || 50) - enrollmentCount
//           };
//         })
//       );

//       return res.status(200).json(coursesWithEnrollment);
//     }

//     return res.status(405).json({ message: 'Method not allowed' });
//   } catch (error) {
//     console.error('Available courses API error:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }


// pages/api/students/[studentId]/available-courses.ts
import { connectDB } from '@/src/lib/mongodb';
import { verify_token } from '@/src/middleware/auth';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  try {
    const { db } = await connectDB();
    const user = await verify_token(req, res);
    if (!user) return;

    const { studentId } = req.query;
    console.log(studentId)
    if (!ObjectId.isValid(studentId as string)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    if (req.method === 'GET') {
      const student = await db.collection('students').findOne({userId: new ObjectId(studentId as string)});
      if (!student) return res.status(404).json({ message: 'Student not found' });

      const enrolledCourseIds = (student.courses || []).map(id => new ObjectId(id));
      const availableCourses = await db.collection('courses').find().toArray();

      const coursesWithEnrollment = await Promise.all(
        availableCourses.map(async course => {
          const count = await db.collection('enrollments').countDocuments({ courseId: course._id, status: 'enrolled' });
          const max = course.maxEnrollment || 50;
          return { ...course, currentEnrollment: count, canEnroll: count < max, spotsRemaining: max - count };
        })
      );
      // console.log(coursesWithEnrollment)

      return res.status(200).json(coursesWithEnrollment);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error('Available courses error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
