// // pages/api/students/[studentId]/bulk-enroll.js
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
//     const { courseIds } = req.body;
//     const { db } = await connectDB();

//     if (!ObjectId.isValid(studentId.toString())) {
//       return res.status(400).json({ message: 'Invalid student ID' });
//     }

//     if (!Array.isArray(courseIds) || courseIds.length === 0) {
//       return res.status(400).json({ message: 'Course IDs array is required' });
//     }

//     // Validate all course IDs
//     const invalidCourseIds = courseIds.filter(id => !ObjectId.isValid(id));
//     if (invalidCourseIds.length > 0) {
//       return res.status(400).json({ 
//         message: 'Invalid course IDs found',
//         invalidIds: invalidCourseIds 
//       });
//     }

//     if (req.method === 'POST') {
//       // Check access permissions
//       if (user.role === 'student' && user.id !== studentId) {
//         return res.status(403).json({ message: 'Access denied' });
//       }

//       const studentObjectId = new ObjectId(studentId.toString());
//       const courseObjectIds = courseIds.map(id => new ObjectId(id));

//       // Get student details
//       const student = await db.collection('students').findOne({ _id: studentObjectId });
//       if (!student) {
//         return res.status(404).json({ message: 'Student not found' });
//       }

//       // Get all course details
//       const courses = await db.collection('courses').find({ 
//         _id: { $in: courseObjectIds },
//         isActive: true 
//       }).toArray();

//       if (courses.length !== courseIds.length) {
//         const foundCourseIds = courses.map(c => c._id.toString());
//         const notFoundIds = courseIds.filter(id => !foundCourseIds.includes(id));
//         return res.status(404).json({ 
//           message: 'Some courses not found or inactive',
//           notFoundIds 
//         });
//       }

//       // Validation checks
//       const errors = [];
//       let totalNewCredits = 0;

//       // Check each course for eligibility
//       for (const course of courses) {
//         // Check year requirement
//         if (course.year > student.yearOfStudy) {
//           errors.push(`${course.code}: Cannot enroll in Year ${course.year} course (You are in Year ${student.yearOfStudy})`);
//           continue;
//         }

//         // Check program match
//         if (course.program !== student.programme) {
//           errors.push(`${course.code}: Course program doesn't match your enrolled program`);
//           continue;
//         }

//         // Check if already enrolled
//         const existingEnrollment = await db.collection('enrollments').findOne({
//           studentId: studentObjectId,
//           courseId: course._id,
//           status: 'enrolled'
//         });

//         if (existingEnrollment) {
//           errors.push(`${course.code}: Already enrolled in this course`);
//           continue;
//         }

//         // Check course capacity
//         const enrollmentCount = await db.collection('enrollments').countDocuments({
//           courseId: course._id,
//           status: 'enrolled'
//         });

//         if (enrollmentCount >= (course.maxEnrollment || 50)) {
//           errors.push(`${course.code}: Course is full`);
//           continue;
//         }

//         totalNewCredits += course.creditUnits;
//       }

//       // Check total credit limit
//       const currentEnrollments = await db.collection('enrollments').aggregate([
//         {
//           $match: {
//             studentId: studentObjectId,
//             status: 'enrolled'
//           }
//         },
//         {
//           $lookup: {
//             from: 'courses',
//             localField: 'courseId',
//             foreignField: '_id',
//             as: 'courseDetails'
//           }
//         },
//         {
//           $unwind: '$courseDetails'
//         },
//         {
//           $group: {
//             _id: null,
//             totalCredits: { $sum: '$courseDetails.creditUnits' }
//           }
//         }
//       ]).toArray();

//       const currentCredits = currentEnrollments.length > 0 ? currentEnrollments[0].totalCredits : 0;
//       const maxCredits = student.maxCreditsAllowed || 48;

//       if (currentCredits + totalNewCredits > maxCredits) {
//         errors.push(`Total credit limit exceeded: Current (${currentCredits}) + New (${totalNewCredits}) = ${currentCredits + totalNewCredits} > Maximum (${maxCredits})`);
//       }

//       if (errors.length > 0) {
//         return res.status(400).json({ 
//           message: 'Bulk enrollment validation failed',
//           errors 
//         });
//       }

//       // All validations passed, proceed with enrollment
//       const enrollments = [];
//       const session = db.client.startSession();

//       try {
//         await session.withTransaction(async () => {
//           const academicYear = new Date().getFullYear().toString();
          
//           // Create enrollment records
//           for (const course of courses) {
//             const enrollment = {
//               studentId: studentObjectId,
//               courseId: course._id,
//               enrollmentDate: new Date(),
//               status: 'enrolled',
//               semester: course.semester,
//               academicYear,
//               createdAt: new Date()
//             };

//             const result = await db.collection('enrollments').insertOne(enrollment, { session });
//             enrollments.push({
//               ...enrollment,
//               _id: result.insertedId,
//               course: {
//                 code: course.code,
//                 name: course.name,
//                 creditUnits: course.creditUnits
//               }
//             });

//             // Update course enrollment count
//             await db.collection('courses').updateOne(
//               { _id: course._id },
//               { 
//                 $inc: { currentEnrollment: 1 },
//                 $set: { updatedAt: new Date() }
//               },
//               { session }
//             );
//           }

//           // Update student's courses array and total credits
//           await db.collection('students').updateOne(
//             { _id: studentObjectId },
//             { 
//               $addToSet: { courses: { $each: courseIds } },
//               $set: { 
//                 totalCreditsEnrolled: currentCredits + totalNewCredits,
//                 updatedAt: new Date() 
//               }
//             },
//             { session }
//           );
//         });

//         return res.status(201).json({ 
//           message: `Successfully enrolled in ${enrollments.length} courses`,
//           enrollments,
//           summary: {
//             enrolledCourses: enrollments.length,
//             totalNewCredits,
//             newTotalCredits: currentCredits + totalNewCredits,
//             remainingCredits: maxCredits - (currentCredits + totalNewCredits)
//           }
//         });

//       } catch (transactionError) {
//         console.error('Transaction error:', transactionError);
//         return res.status(500).json({ 
//           message: 'Failed to complete bulk enrollment',
//           error: transactionError.message 
//         });
//       } finally {
//         await session.endSession();
//       }
//     }

//     return res.status(405).json({ message: 'Method not allowed' });
//   } catch (error) {
//     console.error('Bulk enrollment API error:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }



import { connectDB } from '@/src/lib/mongodb';
import { verify_token } from '@/src/middleware/auth';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { db } = await connectDB();
  const user = await verify_token(req, res);
  if (!user) return;

  const { courseIds } = req.body;
  const {studentId} = req.query;
  if (!Array.isArray(courseIds) || courseIds.length === 0)
    return res.status(400).json({ message: 'No courses provided' });

  try {
    // Add courses to student's record
    const result = await db.collection('students').updateOne(
  { userId: new ObjectId(studentId) },
  { $addToSet: { courses: { $each: courseIds.map(id => new ObjectId(id)) } } }
);
console.log("Matched:", result.matchedCount, "Modified:", result.modifiedCount);


    // Insert enrollments
    await db.collection('enrollments').insertMany(
      courseIds.map(id => ({
        studentId: new ObjectId(studentId),
        courseId: new ObjectId(id),
        status: 'enrolled',
        createdAt: new Date()
      }))
    );

    res.status(200).json({ message: 'Enrollment successful' });
  } catch (err) {
    console.error('Enrollment error:', err);
    res.status(500).json({ message: 'Enrollment failed', error: err.message });
  }
}
