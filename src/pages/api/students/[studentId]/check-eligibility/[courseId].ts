// pages/api/students/[studentId]/available-courses.js
import { connectDB } from '@/src/lib/mongodb';
import { verify_token } from '@/src/middleware/auth';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  try {
    const { db } = await connectDB();

    // Verify token
    const user = await verify_token(req, res);
    if (!user) return; // Unauthorized handled inside verify_token

    const { studentId } = req.query;

    // Validate studentId
    if (!ObjectId.isValid(studentId.toString())) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    if (req.method === 'GET') {
      // Get student details
      const student = await db.collection('students').findOne({
        userId: new ObjectId(studentId.toString()),
      });

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Role-based access (optional)
      // if (user.role === 'student' && user.id !== studentId) {
      //   return res.status(403).json({ message: 'Access denied' });
      // }

      // Fetch available courses
      const enrolledCourseIds = student.courses?.map(id => new ObjectId(id)) || [];

      const availableCourses = await db.collection('courses').find({
        year: { $lte: student.yearOfStudy },
        isActive: true,
        _id: { $nin: enrolledCourseIds }
      }).toArray();

      // Add enrollment info
      const coursesWithEnrollment = await Promise.all(
        availableCourses.map(async (course) => {
          const enrollmentCount = await db.collection('enrollments').countDocuments({
            courseId: course._id,
            status: 'enrolled'
          });

          const maxEnrollment = course.maxEnrollment || 50;
          return {
            ...course,
            currentEnrollment: enrollmentCount,
            canEnroll: enrollmentCount < maxEnrollment,
            spotsRemaining: maxEnrollment - enrollmentCount
          };
        })
      );

      return res.status(200).json(coursesWithEnrollment);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Available courses API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
