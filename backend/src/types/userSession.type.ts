import { Document, Model } from "mongoose";

export interface UserSessionType {
  userId: UserSessionDocumentType;
  refreshToken: string;
  deviceInfo: string;
  ipAddress: string;
  expireAt: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSessionDocumentType extends UserSessionType, Document {}

export interface UserSessionModel extends Model<UserSessionDocumentType> {}
