// pages/api/auth/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/src/lib/mongodb';


const MONGODB_URI = process.env.MONGODB_URI!;
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, fullName, role = 'student' } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }


  try {
    const {db} = await connectDB();
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = {
      email,
      password: hashedPassword,
      fullName,
      role,
      emailVerified: false,
      createdAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    res.status(201).json({ 
      message: 'User created successfully',
      user: result 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
  }
}
