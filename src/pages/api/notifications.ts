import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/src/lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    const { db } = await connectDB();
    
    let notifications = [];
    
    if (decoded.role === 'admin') {
      const pendingCount = await db.collection('profiles').countDocuments({ verificationStatus: 'pending' });
      if (pendingCount > 0) {
        notifications.push({
          id: 'admin-pending-apps',
          title: 'Pending Applications',
          message: `You have ${pendingCount} pending ID card applications to review.`,
          type: 'warning',
          link: '/admin/applications',
          createdAt: new Date().toISOString(),
          read: false
        });
      }
    } else {
      // Student notifications
      const profile = await db.collection('profiles').findOne({ userId: decoded.userId });
      
      if (!profile) {
        notifications.push({
          id: 'profile-missing',
          title: 'Profile Incomplete',
          message: 'Your profile is incomplete. Please complete it to apply for an ID card.',
          type: 'error',
          link: '/dashboard/student-profile',
          createdAt: new Date().toISOString(),
          read: false
        });
      } else {
        const isProfileIncomplete = 
          !profile.full_name || !profile.studentId || !profile.program ||
          !profile.avatar || !profile.sex || !profile.dob ||
          !profile.stateOfOrigin || !profile.phone || !profile.nextOfKin ||
          !profile.kinPhone || !profile.kinAddress;

        if (isProfileIncomplete) {
          notifications.push({
            id: 'profile-incomplete',
            title: 'Profile Action Required',
            message: 'Please update your missing profile details to prevent application rejection.',
            type: 'warning',
            link: '/dashboard/student-profile',
            createdAt: new Date().toISOString(),
            read: false
          });
        }

        if (profile.verificationStatus === 'rejected') {
          notifications.push({
            id: 'verification-rejected',
            title: 'Application Rejected',
            message: 'Your ID card application was rejected. Please review your details and re-apply.',
            type: 'error',
            link: '/dashboard/id-card',
            createdAt: new Date().toISOString(),
            read: false
          });
        }

        if (profile.verificationStatus === 'approved') {
          notifications.push({
            id: 'verification-approved',
            title: 'Application Approved',
            message: 'Congratulations! Your digital ID card has been approved and is ready.',
            type: 'success',
            link: '/dashboard/id-card',
            createdAt: new Date().toISOString(),
            read: false
          });
        }

        if (profile.verificationStatus === 'approved' && profile.createdAt) {
          const baseDate = new Date(profile.createdAt);
          const expiryYear = baseDate.getFullYear() + 2;
          const expiryDate = new Date(expiryYear, 11, 31, 23, 59, 59);
          
          const warningDate = new Date(expiryDate);
          warningDate.setMonth(warningDate.getMonth() - 3);

          if (new Date() > warningDate && new Date() < expiryDate) {
            notifications.push({
              id: 'card-expiry-warning',
              title: 'Card Expiring Soon',
              message: 'Your active ID card is nearing expiration. You will need to renew it soon.',
              type: 'warning',
              link: '/dashboard/id-card',
              createdAt: new Date().toISOString(),
              read: false
            });
          } else if (new Date() > expiryDate) {
            notifications.push({
              id: 'card-expired',
              title: 'Card Expired',
              message: 'Your ID card has expired. Please apply for a new card.',
              type: 'error',
              link: '/dashboard/id-card',
              createdAt: new Date().toISOString(),
              read: false
            });
          }
        }
      }
    }

    res.status(200).json({ notifications, unreadCount: notifications.length });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
