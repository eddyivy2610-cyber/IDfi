// pages/api/students/[studentId]/drop.js
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
    const { courseId } = req.body;
    const { db } = await connectDB();

    if (!ObjectId.isValid(studentId.toString()) || !ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid student or course ID' });
    }

    if (req.method === 'POST') {
      // Check access permissions
    //   if (user.role === 'student' && user.id !== studentId) {
    //     return res.status(403).json({ message: 'Access denied' });
    //   }

      const studentObjectId = new ObjectId(studentId as string);
      const courseObjectId = new ObjectId(courseId as string);

      // Check if enrolled
      const enrollment = await db.collection('enrollments').findOne({
        studentId: studentObjectId,
        courseId: courseObjectId,
        status: 'enrolled'
      });

      if (!enrollment) {
        return res.status(404).json({ message: 'Enrollment not found' });
      }

      // Get course details for credit calculation
      const course = await db.collection('courses').findOne({ _id: courseObjectId });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      
      // Update student's courses array and credit count
      const student = await db.collection('students').findOne({ userId: studentObjectId });
      if(!student) return res.status(400).json({message: "student not found!"})
        const newTotalCredits = (student.totalCreditsEnrolled || 0) - course.creditUnits;
      
      await db.collection('students').updateOne(
        { _id: studentObjectId },
        { 
          $pull: { courses: courseObjectId },
          $set: { 
            totalCreditsEnrolled: Math.max(0, newTotalCredits),
            updatedAt: new Date() 
          }
        }
      );
      // Update enrollment status to dropped
      await db.collection('enrollments').updateOne(
        { _id: enrollment._id },
        { 
          $set: { 
            status: 'dropped',
            updatedAt: new Date()
          }
        }
      );
      
      // Update course enrollment count
      await db.collection('courses').updateOne(
        { _id: courseObjectId },
        { 
          $inc: { currentEnrollment: -1 },
          $set: { updatedAt: new Date() }
        }
      );

      return res.status(200).json({ 
        message: 'Successfully dropped course',
        droppedCourse: {
          code: course.code,
          name: course.name,
          creditUnits: course.creditUnits
        }
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Course drop API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

