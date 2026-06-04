import mongoose, { ObjectId, Schema, Document } from "mongoose";
// Enrollment Interface for tracking enrollments
export interface Enrollment {
  _id?: ObjectId;
  studentId: ObjectId;
  courseId: ObjectId;
  enrollmentDate: Date;
  status: 'enrolled' | 'dropped' | 'completed' | 'failed';
  grade?: string;
  gradePoints?: number;
  semester: number;
  academicYear: string;
  createdAt: Date;
  updatedAt?: Date;
}

const EnrollmentSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  enrollmentDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['enrolled', 'dropped', 'completed', 'failed'], 
    default: 'enrolled' 
  },
  grade: { type: String },
  gradePoints: { type: Number },
  semester: { type: Number, required: true },
  academicYear: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

// Compound index to prevent duplicate enrollments
EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model<Enrollment>("Enrollment", EnrollmentSchema);