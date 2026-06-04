// // src/middleware/auth.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import { verifyToken } from '@/src/lib/auth/jwt';
// import { UserService } from '@/src/lib/database/userService';

// import jwt, { JwtPayload } from "jsonwebtoken";

// // Define the expected user payload type
// export interface DecodedUser extends JwtPayload {
//   id: string;
//   role: "admin" | "student" | "lecturer" | string;
//   email?: string;
// }

// type Handler = (req: NextApiRequest & { user?: DecodedUser }, res: NextApiResponse) => Promise<void> | void;

// /**
//  * Verify JWT token and return the decoded user object
//  */
// export const verify_token = (req: NextApiRequest, res: NextApiResponse): DecodedUser | null => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       res.status(401).json({ message: "Access denied. No token provided." });
//       return null;
//     }

//     const token = authHeader.substring(7); // Remove 'Bearer ' prefix

//     if (!token) {
//       res.status(401).json({ message: "Access denied. No token provided." });
//       return null;
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedUser;
//     return decoded;
//   } catch (error: any) {
//     if (error.name === "TokenExpiredError") {
//       res.status(401).json({ message: "Token expired" });
//     } else if (error.name === "JsonWebTokenError") {
//       res.status(401).json({ message: "Invalid token" });
//     } else {
//       res.status(500).json({ message: "Token verification failed" });
//     }
//     return null;
//   }
// };

// /**
//  * Middleware for routes requiring authentication
//  */
// export const requireAuth = (handler: Handler) => {
//   return async (req: NextApiRequest, res: NextApiResponse) => {
//     const user = verifyToken(req, res);
//     if (!user) return;

//     (req as NextApiRequest & { user?: DecodedUser }).user = user;
//     return handler(req as NextApiRequest & { user: DecodedUser }, res);
//   };
// };

// /**
//  * Middleware for routes requiring specific roles
//  */
// export const requireRole = (roles: string[]) => {
//   return (handler: Handler) => {
//     return async (req: NextApiRequest, res: NextApiResponse) => {
//       const user = verifyToken(req, res);
//       if (!user) return;

//       if (!roles.includes(user.role)) {
//         return res.status(403).json({ message: "Access denied. Insufficient permissions." });
//       }

//       (req as NextApiRequest & { user?: DecodedUser }).user = user;
//       return handler(req as NextApiRequest & { user: DecodedUser }, res);
//     };
//   };
// };

// // Role-based middlewares
// export const requireAdmin = requireRole(["admin"]);
// export const requireStudent = requireRole(["student"]);
// export const requireLecturer = requireRole(["lecturer"]);
// export const requireStudentOrAdmin = requireRole(["student", "admin"]);
// export const requireLecturerOrAdmin = requireRole(["lecturer", "admin"]);



// // **************************************************************

// export interface AuthenticatedRequest extends NextApiRequest {
//   user: {
//     userId: string;
//     email: string;
//   };
// }

// export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
//   return async (req: NextApiRequest, res: NextApiResponse) => {
//     try {
//       const authHeader = req.headers.authorization;
//       const token = authHeader?.split(' ')[1];

//       if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//       }

//       const decoded = verifyToken(token);
      
//       // Verify user still exists
//       const user = await UserService.findUserById(decoded.userId);
//       if (!user) {
//         return res.status(401).json({ message: 'User not found' });
//       }

//       // Add user data to request
//       (req as AuthenticatedRequest).user = decoded;

//       return handler(req as AuthenticatedRequest, res);
//     } catch (error) {
//       console.error('Auth middleware error:', error);
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//   };
// }

// src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export async function verify_token(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' });
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded; // contains user data
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'name' in err && (err as { name?: string }).name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired' });
      return null;
    }

    res.status(401).json({ message: 'Invalid token' });
    return null;
  }
}
