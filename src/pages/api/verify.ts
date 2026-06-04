import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/src/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    // 1. Verify the Cryptographic Signature
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ valid: false, error: 'Invalid or forged signature' });
    }

    if (!decoded || !decoded.studentId) {
      return res.status(401).json({ valid: false, error: 'Malformed token payload' });
    }

    // 2. Fetch the live student data from the database
    const { db } = await connectDB();
    const student = await db.collection('students').findOne({ studentId: decoded.studentId });

    if (!student) {
      return res.status(404).json({ valid: false, error: 'Student not found in active records' });
    }

    // 3. Return the sanitized live data for the guard to verify
    return res.status(200).json({
      valid: true,
      student: {
        full_name: student.full_name,
        studentId: student.studentId,
        program: student.program,
        avatar: student.avatar,
        verificationStatus: student.verificationStatus,
        isVerified: student.isVerified
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ valid: false, error: 'Internal server error during verification' });
  }
}
