// src/lib/models/User.ts
import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string; // hashed
  full_name: string;
  role: 'student' | 'lecturer' | 'admin';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
}

export interface UserPublic {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "lecturer" | "admin";
  emailVerified: boolean;
  createdAt: Date;
}
