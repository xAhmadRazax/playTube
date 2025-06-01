import { Document, Model } from "mongoose";
import { VideoDocumentType } from "./videoModel.type.js";

export interface UserSchemaType {
  username: string;
  email: string;
  fullName: string;
  password: string;
  avatar: string | undefined;
  coverImage: string | undefined;
  watchHistory: VideoDocumentType[];
  refreshTokens: string[];
  passwordResetToken?: string;
  passwordResetExpiry?: number;
  passwordChangedAt?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUserType = Omit<
  UserSchemaType,
  | "password"
  | "refreshTokens"
  | "passwordChangedAt"
  | "passwordResetToken"
  | "passwordResetExpiry"
  | "createdAt"
  | "updatedAt"
>;

export interface UserDocumentType extends UserSchemaType, Document {
  isPasswordCorrect(candidatePassword: string): Promise<boolean>;
  hasPasswordChangedAfterJWTTokenIssued(tokenIssuedAtInSecs: number): boolean;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  updateRefreshToken(
    // tokenArr: string[],
    token: string,
    device: string,
    ip: string,
    removeTokenFlag?: boolean
  ): Promise<void>;
}
export interface UserModelType extends Model<UserDocumentType> {}
