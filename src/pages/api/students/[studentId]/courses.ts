// pages/api/students/[studentId]/courses.js
import { connectDB } from '@/src/lib/mongodb';
import { verify_token } from '@/src/middleware/auth';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();
    
    const user = verify_token(req, res);
    if (!user) return;

    const { studentId } = req.query;
    const { db } = await connectDB();

    if (!ObjectId.isValid(studentId.toString())) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    if (req.method === 'GET') {
      // Check access permissions
    //   if (user.role === 'student' && user.id !== studentId) {
    //     return res.status(403).json({ message: 'Access denied' });
    //   }

      // Get student's enrolled courses with details
      const enrollments = await db.collection('enrollments').aggregate([
        {
          $match: {
            studentId: new ObjectId(studentId.toString()),
            status: 'enrolled'
          }
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'courseId',
            foreignField: '_id',
            as: 'courseDetails'
          }
        },
        {
          $unwind: '$courseDetails'
        },
        {
          $lookup: {
            from: 'lecturers',
            localField: 'courseDetails.lecturerId',
            foreignField: '_id',
            as: 'lecturerDetails'
          }
        },
        {
          $project: {
            _id: 1,
            enrollmentDate: 1,
            status: 1,
            course: {
              _id: '$courseDetails._id',
              code: '$courseDetails.code',
              name: '$courseDetails.name',
              creditUnits: '$courseDetails.creditUnits',
              semester: '$courseDetails.semester',
              year: '$courseDetails.year',
              program: '$courseDetails.program',
              description: '$courseDetails.description'
            },
            lecturer: {
              $cond: {
                if: { $gt: [{ $size: '$lecturerDetails' }, 0] },
                then: { $arrayElemAt: ['$lecturerDetails.name', 0] },
                else: 'Not Assigned'
              }
            }
          }
        }
      ]).toArray();

      // Calculate total credits
      const totalCredits = enrollments.reduce((sum, enrollment) => 
        sum + (enrollment.course.creditUnits || 0), 0
      );

      return res.status(200).json({
        enrollments,
        totalCredits,
        coursesCount: enrollments.length
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Student courses API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
