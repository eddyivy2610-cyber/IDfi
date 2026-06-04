// pages/api/users/[id]/profile.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Db, Document, ObjectId, WithId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/src/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET!;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { studentId } = req.query;
    const { db } = await connectDB();
    
    if (req.method === 'GET') {
      return await getProfile(req, res, db, studentId as string);
    }
    
    if (req.method === 'PUT') {
      return await updateProfile(req, res, db, studentId as string);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error: unknown) {
    console.error("Top-level handler error:", error);
    const details = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ message: 'Internal server error', details });
  }
}

type JwtErrorLike = { name?: string };

function isTokenExpiredError(error: unknown) {
  return typeof error === 'object' && error !== null && (error as JwtErrorLike).name === 'TokenExpiredError';
}

function isJsonWebTokenError(error: unknown) {
  return typeof error === 'object' && error !== null && (error as JwtErrorLike).name === 'JsonWebTokenError';
}

async function getProfile(req: NextApiRequest, res: NextApiResponse, db: Db, userId: string) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const profiles = db.collection('profiles');

    let profile: WithId<Document> | null = await profiles.findOne({ userId });

    if (!profile) {
      // Create default profile if it doesn't exist
       profile = {
        _id: new ObjectId(),
        userId,
        bio: '',
        avatar: '',
        preferences: {},
        createdAt: new Date(),
      };
      
      await profiles.insertOne(profile);

      return res.status(200).json(profile);
    }
    res.status(200).json(profile);
  } catch (error: unknown) {
    console.error('Error fetching profile:', error);
    if (isTokenExpiredError(error)) {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }

    return res.status(401).json({ message: 'Invalid token' });
  }
}

async function updateProfile(req: NextApiRequest, res: NextApiResponse, db: Db, userId: string) {
  const authHeader = req.headers.authorization;
  const token = Array.isArray(authHeader) ? authHeader[0]?.split(' ')[1] : authHeader?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify token and ensure user can only update their own profile
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    if (decoded.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const profiles = db.collection('profiles');

    // Check if the card is eligible for renewal (expired or within 3 months of expiry)
    const existingProfile = await profiles.findOne({ userId });
    let shouldResetCreatedAt = false;
    if (existingProfile && existingProfile.createdAt) {
      const baseDate = new Date(existingProfile.createdAt);
      const expiryYear = baseDate.getFullYear() + 2;
      const expiryDate = new Date(expiryYear, 11, 31, 23, 59, 59);

      const renewalEligibilityDate = new Date(expiryDate);
      renewalEligibilityDate.setMonth(renewalEligibilityDate.getMonth() - 3);

      if (new Date() > renewalEligibilityDate) {
        shouldResetCreatedAt = true;
      }
    }

    const updateData: Record<string, unknown> = {
      ...req.body,
      userId,
      updatedAt: new Date(),
    };

    if (shouldResetCreatedAt) {
      updateData.createdAt = new Date();
    }

    const result = await profiles.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { upsert: true, returnDocument: 'after' }
    );

    const updatedDoc = result?.value ?? null;

    res.status(200).json({ data: updatedDoc });
  } catch (error: unknown) {
    console.error('Error updating profile:', error);
    if (isTokenExpiredError(error)) {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }

    if (isJsonWebTokenError(error)) {
      return res.status(401).json({ message: 'Invalid token', code: 'TOKEN_INVALID' });
    }

    const details = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: 'Internal server error', details });
  }
}
