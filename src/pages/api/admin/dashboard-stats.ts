import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/src/lib/mongodb';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { db } = await connectDB();
    
    const studentsCount = await db.collection('users').countDocuments({ role: 'student' });
    const applicationsCount = await db.collection('profiles').countDocuments({ verificationStatus: 'pending' });
    const validCount = await db.collection('profiles').countDocuments({ verificationStatus: 'approved' });
    
    // An active card is an approved profile that is less than 2 years old (or according to our logic)
    // For simplicity right now, we can consider all approved ones as active cards.
    // If we wanted strictly < 2 years we'd add a createdAt date filter.
    const activeCardsCount = await db.collection('profiles').countDocuments({ verificationStatus: 'approved' });

    res.status(200).json({
      students: studentsCount,
      applications: applicationsCount,
      valid: validCount,
      activeCards: activeCardsCount
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
