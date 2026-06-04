// src/lib/models/Profile.ts
import { ObjectId } from 'mongodb';

export interface Profile {
    full_name?: string;
    email?: string;
    role?: 'student' | 'lecturer' | 'admin';
  _id?: ObjectId;
  userId: string; // References User._id
  bio?: string;
  avatar?: string;
  dateOfBirth?: Date;
  phone?: string;
  program?: string;
  study_year?: number;
  sex?: string;
  dob?: string;
  stateOfOrigin?: string;
  signature?: string;
  nextOfKin?: string;
  kinAddress?: string;
  kinPhone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    notifications?: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
}
