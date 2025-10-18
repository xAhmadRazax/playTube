export interface User {
  email: string;
  username: string;
  fullName: string;
  avatar: string;
  isVerified: boolean;
  accountStatus: 'active' | 'suspended' | 'banned';
  monetizationStatus:
    | 'eligible'
    | 'not_eligible'
    | 'pending_review'
    | 'rejected';
  gender: 'male' | 'female' | 'others';
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
  dateOfBirth: string;
}
