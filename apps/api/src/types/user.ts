import { UserRole } from '../enums/user-role.enum';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
