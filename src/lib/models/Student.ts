// import { ObjectId } from "mongodb";

// export interface Student {
//     _id?: ObjectId;
//     userId: string; // References User._id
//     enrollmentNumber: string;
//     courses: string[]; // Array of Course IDs
//     yearOfStudy: number;
//     programme: string;
//     gpa?: number;
//     createdAt: Date;
//     updatedAt?: Date;
//     // Add other student-specific fields as needed
//     profileCompleted: boolean;
//     dateOfBirth?: Date;
//     phone?: string;
//     address?: {
//         street?: string;
//         city?: string;
//         state?: string;
//         country?: string;
//     };
//     socialLinks?: {
//         twitter?: string;
//         linkedin?: string;
//         github?: string;
//     };
// }   


// Updated Student Interface
import { ObjectId } from "mongodb";

export interface Student {
  _id?: ObjectId;
  userId: ObjectId; // References User._id
  name: string;
  enrollmentNumber: string;
  courses: string[]; // Array of Course IDs
  yearOfStudy: number;
  program: string;
  gpa?: number;
  totalCreditsEnrolled: number; // New field to track enrolled credits
  maxCreditsAllowed: number; // Maximum credits allowed (default: 48)
  createdAt: Date;
  updatedAt?: Date;
  profileCompleted: boolean;
  dateOfBirth?: Date;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}