import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/src/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_idfi_2026';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { token, studentId: rawStudentId } = req.query;

  let targetId: string | null = null;

  // 1. If a JWT token was provided in the query string
  if (token && typeof token === 'string') {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (decoded && (decoded.studentId || decoded.userId || decoded.id)) {
        targetId = decoded.studentId || decoded.userId || decoded.id;
      } else {
        return res.status(401).json({ valid: false, error: 'Malformed token payload' });
      }
    } catch (err) {
      return res.status(401).json({ valid: false, error: 'Invalid or forged cryptographic signature' });
    }
  } else if (rawStudentId && typeof rawStudentId === 'string') {
    // Fallback for direct manual search / matric number
    targetId = rawStudentId.trim();
  } else {
    return res.status(400).json({ valid: false, error: 'Verification token or student ID is required' });
  }

  try {
    const { db } = await connectDB();

    // Build flexible query to match studentId, userId, or _id
    const queryConditions: any[] = [
      { studentId: targetId },
      { userId: targetId },
      { enrollmentNumber: targetId },
    ];

    if (ObjectId.isValid(targetId)) {
      queryConditions.push({ _id: new ObjectId(targetId) });
      queryConditions.push({ userId: new ObjectId(targetId) });
    }

    // 2. Query 'profiles' collection first (contains rich bio-data and photo)
    let profile = await db.collection('profiles').findOne({ $or: queryConditions });

    // Also look up corresponding user account
    let user = null;
    if (profile && profile.userId) {
      if (ObjectId.isValid(profile.userId)) {
        user = await db.collection('users').findOne({ _id: new ObjectId(profile.userId) });
      } else {
        user = await db.collection('users').findOne({ _id: profile.userId });
      }
    } else if (ObjectId.isValid(targetId)) {
      user = await db.collection('users').findOne({ _id: new ObjectId(targetId) });
      if (user && !profile) {
        profile = await db.collection('profiles').findOne({
          $or: [
            { userId: user._id.toString() },
            { userId: user._id },
            { email: user.email }
          ]
        });
      }
    }

    // Fallback: check 'students' collection
    let studentRecord = null;
    if (!profile) {
      studentRecord = await db.collection('students').findOne({ $or: queryConditions });
    }

    if (!profile && !studentRecord && !user) {
      return res.status(404).json({
        valid: false,
        error: 'Student record not found in active university database',
      });
    }

    // 3. Assemble authoritative sanitized profile
    const fullName = profile?.full_name || profile?.fullName || user?.full_name || user?.fullName || studentRecord?.name || 'Registered Student';
    const displayStudentId = profile?.studentId || studentRecord?.enrollmentNumber || targetId;
    const program = profile?.program || studentRecord?.program || studentRecord?.programme || 'Computer Science';
    const avatar = profile?.avatar || profile?.photo || studentRecord?.avatar || '';
    const verificationStatus = profile?.verificationStatus || 'approved';
    const studyYear = profile?.study_year || studentRecord?.yearOfStudy || 1;

    // Check if the card is actively approved
    const isApproved = verificationStatus === 'approved';

    return res.status(200).json({
      valid: true,
      isApproved,
      student: {
        full_name: fullName,
        studentId: displayStudentId,
        program,
        avatar,
        verificationStatus,
        study_year: studyYear,
        level: `${studyYear * 100} Level`,
      },
    });

  } catch (error) {
    console.error('Verification handler error:', error);
    return res.status(500).json({
      valid: false,
      error: 'Internal server error during verification process',
    });
  }
}
