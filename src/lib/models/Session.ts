// src/lib/models/Session.ts
import { UserPublic } from './User';

export interface Session {
  token: string;
  user: UserPublic;
  expiresAt: Date;
}