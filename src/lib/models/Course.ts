// import mongoose, { Schema, Document } from "mongoose";
// import { ObjectId } from "mongodb";

//  export interface Course extends Document {
//   _id: ObjectId;
//   code: string;
//   name: string;
//   semester: number;
//   year: number;
//   program: string;
//   lecturerId?: ObjectId[];
//   createdAt: Date;
//   updatedAt?: Date;
// }

// export default Course;

// Updated Course Interface
import mongoose, { Schema, Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface Course extends Document {
  _id: ObjectId;
  code: string;
  name: string;
  description?: string;
  creditUnits: number; // New field for credit units
  semester: number;
  year: number;
  program: string;
  lecturerId?: ObjectId[];
  prerequisites?: string[]; // Array of course codes that must be completed first
  maxEnrollment?: number; // Maximum students that can enroll
  currentEnrollment: number; // Current number of enrolled students
  isActive: boolean; // Whether course is available for enrollment
  createdAt: Date;
  updatedAt?: Date;
}

const CourseSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  creditUnits: { type: Number, required: true, min: 1, max: 6 },
  semester: { type: Number, required: true, enum: [1, 2] },
  year: { type: Number, required: true, min: 1, max: 6 },
  program: { type: String, required: true },
  lecturerId: [{ type: Schema.Types.ObjectId, ref: "User" }],
  prerequisites: [{ type: String }], // Array of course codes
  maxEnrollment: { type: Number, default: 50 },
  currentEnrollment: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default mongoose.models.Course || mongoose.model<Course>("Course", CourseSchema);