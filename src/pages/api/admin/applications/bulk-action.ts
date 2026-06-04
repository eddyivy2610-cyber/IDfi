import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/src/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userIds, action } = req.body;

    if (!Array.isArray(userIds) || !userIds.length) {
      return res.status(400).json({ message: "No users selected" });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const { db } = await connectDB();

    const verificationStatus = action === 'approve' ? 'approved' : 'rejected';
    const isVerified = action === 'approve';

    // We need to update profiles for the selected users
    // userIds could be string IDs of the User model
    const objectIds = userIds.map(id => {
      try {
        return new ObjectId(id);
      } catch(e) {
        return id;
      }
    });

    const result = await db.collection("profiles").updateMany(
      { 
        $or: [
          { userId: { $in: objectIds } },
          { userId: { $in: userIds } },
          { _id: { $in: objectIds } } // Just in case we get profile IDs instead
        ]
      },
      { 
        $set: { 
          verificationStatus: verificationStatus,
          isVerified: isVerified,
          updatedAt: new Date()
        } 
      }
    );

    // Also update the students collection if that's being used interchangeably
    await db.collection("students").updateMany(
      { 
        $or: [
          { userId: { $in: objectIds } },
          { userId: { $in: userIds } },
          { _id: { $in: objectIds } }
        ]
      },
      { 
        $set: { 
          verificationStatus: verificationStatus,
          isVerified: isVerified,
          updatedAt: new Date()
        } 
      }
    );

    return res.status(200).json({ 
      message: `Successfully ${action}d ${result.modifiedCount} applications`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error("Bulk action error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
