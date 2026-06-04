import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { studentId } = req.query;

  if (!studentId || typeof studentId !== 'string') {
    return res.status(400).json({ message: 'studentId is required' });
  }

  try {
    // Generate a secure signature that encodes the student's registration number
    // This token has no explicit expiration because ID cards are printed and used for 4+ years
    const token = jwt.sign(
      { studentId },
      JWT_SECRET
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Sign card error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
