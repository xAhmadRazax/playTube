export interface User {
  email: string;
  username: string;
  fullName: string;
  avatar: string;
  isVerified: boolean;
  accountStatus: string;
  monetizationStatus: string;
  watchHistory: Array<any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterUserType {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  gender: string;
  // avatar: File | null
  birthday: Date | undefined;
}
