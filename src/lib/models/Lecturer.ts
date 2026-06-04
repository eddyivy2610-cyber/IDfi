// // import mongoose, { Schema, Document } from "mongoose";
// import { ObjectId } from "mongodb";

// export interface Lecturer extends Document {
//   _id: ObjectId;
//   name: string;
//   email: string;
//   department: string;
//   courses: ObjectId;
//   createdAt: Date;
//   updatedAt?: Date;
// }

// // const LecturerSchema: Schema = new Schema({
// //   userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
// //   department: { type: String, required: true },
// //   bio: { type: String },
// //   createdAt: { type: Date, default: Date.now },
// //   updatedAt: { type: Date },
// // });

// // export default mongoose.models.Lecturer || mongoose.model<Lecturer>("Lecturer", LecturerSchema);

// export default Lecturer;

// Updated Lecturer Interface
import { ObjectId } from "mongodb";
import mongoose, {Schema, Document} from "mongoose";

export interface Lecturer extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  department: string;
  assignedCourses: ObjectId[]; // Changed from single course to array
  bio?: string;
  office?: string;
  phone?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const LecturerSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  assignedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  bio: { type: String },
  office: { type: String },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

export default mongoose.models.Lecturer || mongoose.model<Lecturer>("Lecturer", LecturerSchema);