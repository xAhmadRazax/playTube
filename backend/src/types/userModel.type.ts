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
  isVerified: boolean;
  accountStatus: "active" | "suspended" | "banned";
  monetizationStatus:
    | "eligible"
    | "not_eligible"
    | "pending_review"
    | "rejected";
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  passwordChangedAt?: number;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
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

  generateVerifyToken(): string;
  generatePasswordResetToken(): string;
  isPasswordResetTokenValid(): string;
}
export interface UserModelType extends Model<UserDocumentType> {
  generateCryptoToken(): string;
  encryptCryptoToken(
    token: string,
    algo?:
      | "md5"
      | "sha1"
      | "sha224"
      | "sha256"
      | "sha384"
      | "sha512"
      | "sha3-224"
      | "sha3-256"
      | "sha3-384"
      | "sha3-512"
      | "ripemd160"
      | "blake2b512"
      | "blake2s256"
  ): string;
}
