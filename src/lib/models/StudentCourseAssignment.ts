import mongoose, { Schema, Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface StudentCourseAssignment extends Document {
  _id: ObjectId;
  studentId: ObjectId;
  courseId: ObjectId;
  createdAt: Date;
}

const StudentCourseAssignmentSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.StudentCourseAssignment ||
  mongoose.model<StudentCourseAssignment>("StudentCourseAssignment", StudentCourseAssignmentSchema);