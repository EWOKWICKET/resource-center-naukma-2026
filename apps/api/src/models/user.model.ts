import mongoose, { Schema } from 'mongoose';
import { UserRole } from '../enums/user-role.enum';

interface UserModel {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  bio?: string;
  role: UserRole;
}

const userSchema = new Schema<UserModel>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    bio: { type: String, trim: true },
    role: { type: String, required: true, enum: Object.values(UserRole), default: UserRole.User },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<UserModel>('User', userSchema);
