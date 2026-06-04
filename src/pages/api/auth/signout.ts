// pages/api/auth/signout.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // With JWT tokens, signout is mainly client-side
  // You could implement a token blacklist here if needed
  
  res.status(200).json({ message: 'Signed out successfully' });
}

