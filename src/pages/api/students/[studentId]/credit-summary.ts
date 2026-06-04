// pages/api/students/[studentId]/credit-summary.js
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

    if (!ObjectId.isValid(studentId as string)) {
      return res.status(400).json({ message: 'Invalid student ID' });
    }

    if (req.method === 'GET') {
      // Check access permissions
    //   if (user.role === 'student' && user.id !== studentId) {
    //     return res.status(403).json({ message: 'Access denied' });
    //   }

      const studentObjectId = new ObjectId(studentId as string);

      // Get student details
      const student = await db.collection('students').findOne({ userId: studentObjectId });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Get detailed credit breakdown
      const creditBreakdown = await db.collection('enrollments').aggregate([
        {
          $match: {
            studentId: studentObjectId,
            status: { $in: ['enrolled', 'completed'] }
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
          $group: {
            _id: '$status',
            totalCredits: { $sum: '$courseDetails.creditUnits' },
            courseCount: { $sum: 1 }
          }
        }
      ]).toArray();

      const enrolledCredits = creditBreakdown.find(item => item._id === 'enrolled')?.totalCredits || 0;
      const completedCredits = creditBreakdown.find(item => item._id === 'completed')?.totalCredits || 0;
      const maxCredits = student.maxCreditsAllowed || 48;

      return res.status(200).json({
        studentId,
        enrolledCredits,
        completedCredits,
        totalCredits: enrolledCredits + completedCredits,
        maxCreditsAllowed: maxCredits,
        remainingCredits: maxCredits - enrolledCredits,
        canEnrollMoreCredits: enrolledCredits < maxCredits,
        creditUtilization: Math.round((enrolledCredits / maxCredits) * 100),
        breakdown: creditBreakdown
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Credit summary API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}