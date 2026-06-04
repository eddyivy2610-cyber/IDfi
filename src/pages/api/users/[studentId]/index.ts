// pages/api/students/[studentId]/index.ts
import { connectDB } from '@/src/lib/mongodb';
import { verify_token } from '@/src/middleware/auth';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect DB
    const { db } = await connectDB();

    // Verify token
    const user = await verify_token(req, res);
    if (!user) return; // Unauthorized handled by middleware

    const { studentId } = req.query;
    if (!studentId || typeof studentId !== 'string') {
      return res.status(400).json({ message: 'Student ID is required' });
    }

    // Decide whether to use ObjectId or userId string
    let studentQuery: any;
    if (ObjectId.isValid(studentId)) {
      studentQuery = { userId: new ObjectId(studentId as string) };
    } else {
      studentQuery = { userId: studentId };
    }

    // Handle DELETE request
    if (req.method === 'DELETE') {
        console.log(req.query)
      const result = await db.collection('students').deleteOne(studentQuery);

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      return res.status(200).json({ message: 'Student deleted successfully' });
    }

    // If method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error('Delete student error:', err);
    return res.status(500).json({ message: 'Server error', error: err });
  }
}
