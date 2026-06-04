import mongoose, { Schema, Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface Complaint extends Document {
  _id: ObjectId;
  studentId: ObjectId;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
}

// const ComplaintSchema: Schema = new Schema({
//   studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   text: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date },
// });

// export default mongoose.models.Complaint || mongoose.model<Complaint>("Complaint", ComplaintSchema);

export default Complaint;