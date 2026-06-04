

// pages/api/students/[studentId]/enroll.js
import { connectDB } from '@/src/lib/mongodb';
import { verify_token } from '@/src/middleware/auth';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    
    const user = verify_token(req, res);
    if (!user) return;

    const { studentId } = req.query;
    const { courseId } = req.body;
    const { db } = await connectDB();

    if (!ObjectId.isValid(studentId) || !ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid student or course ID' });
    }

    if (req.method === 'POST') {
      // Check access permissions
    //   if (user.role === 'student' && user.id !== studentId) {
    //     return res.status(403).json({ message: 'Access denied' });
    //   }

      const studentObjectId = new ObjectId(studentId);
      const courseObjectId = new ObjectId(courseId);

      // Get student details
      const Student = db.collection('students')
      const student = await Student.findOne({ userId: studentObjectId });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      console.log(req.body)

      // Get course details
      const course = await db.collection('courses').findOne({ _id: new ObjectId(courseId) });
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // Check if course is active
      if (!course.isActive) {
        return res.status(400).json({ message: 'Course is not available for enrollment' });
      }

      // Check if student is eligible (year requirement)
      if (course.year > student.yearOfStudy) {
        return res.status(400).json({ 
          message: `Cannot enroll in Year ${course.year} course. You are in Year ${student.yearOfStudy}` 
        });
      }

      // Check if student's program matches course program
      if (course.program !== student.programme) {
        return res.status(400).json({ 
          message: 'Course program does not match your enrolled program' 
        });
      }

      // Check if already enrolled
      const existingEnrollment = await db.collection('enrollments').findOne({
        studentId: new ObjectId(studentId),
        courseId: new ObjectId(courseId),
        status: 'enrolled'
      });

      if (existingEnrollment) {
        return res.status(400).json({ message: 'Already enrolled in this course' });
      }

      // Calculate current credit load
      const currentEnrollments = await db.collection('enrollments').aggregate([
        {
          $match: {
            studentId: new ObjectId(studentId),
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
          $group: {
            _id: null,
            totalCredits: { $sum: '$courseDetails.creditUnits' }
          }
        }
      ]).toArray();

      const currentCredits = currentEnrollments.length > 0 ? currentEnrollments[0].totalCredits : 0;
      const maxCredits = student.maxCreditsAllowed || 48;

      // Check credit limit
      if (currentCredits + course.creditUnits > maxCredits) {
        return res.status(400).json({ 
          message: `Cannot enroll. This would exceed your credit limit of ${maxCredits}. Current: ${currentCredits}, Course: ${course.creditUnits}` 
        });
      }

      // Check course capacity
      const enrollmentCount = await db.collection('enrollments').countDocuments({
        courseId: courseObjectId,
        status: 'enrolled'
      });

      if (enrollmentCount >= (course.maxEnrollment || 50)) {
        return res.status(400).json({ message: 'Course is full' });
      }

      // Create enrollment record
      const enrollment = {
        studentId: new ObjectId(studentId),
        courseId: new ObjectId(courseId),
        enrollmentDate: new Date(),
        status: 'enrolled',
        semester: course.semester,
        academicYear: new Date().getFullYear().toString(),
        createdAt: new Date()
      };

      await db.collection('enrollments').insertOne(enrollment);

      // Update student's courses array
      await db.collection('students').updateOne(
        { _id: new ObjectId(studentId) },
        { 
          $addToSet: { courses: courseId },
          $set: { 
            totalCreditsEnrolled: currentCredits + course.creditUnits,
            updatedAt: new Date() 
          }
        }
      );

      // Update course enrollment count
      await db.collection('courses').updateOne(
        { _id: new ObjectId(courseId) },
        { 
          $inc: { currentEnrollment: 1 },
          $set: { updatedAt: new Date() }
        }
      );

      return res.status(201).json({ 
        message: 'Successfully enrolled in course',
        enrollment: {
          ...enrollment,
          course: {
            code: course.code,
            name: course.name,
            creditUnits: course.creditUnits
          }
        }
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Course enrollment API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}