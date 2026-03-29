import { UserModel } from '../models/user.model';
import { UserDoc, toUser } from '../mappers/user.mapper';
import { User } from '../types';
import { UserRole } from '../enums/user-role.enum';

export const usersRepository = {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).lean<UserDoc>();

    return doc ? toUser(doc) : null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).lean<UserDoc>();

    return doc ? toUser(doc) : null;
  },

  // Returns mapped User with passwordHash — used only by auth service
  async findByEmailWithPasswordHash(email: string): Promise<(User & { passwordHash: string }) | null> {
    const doc = await UserModel.findOne({ email }).lean<UserDoc>();
    if (!doc) return null;

    return { ...toUser(doc), passwordHash: doc.passwordHash };
  },

  async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isVerified: boolean;
    expiresAt: Date;
  }): Promise<User> {
    const doc = await UserModel.create(data);

    return toUser(doc.toObject() as unknown as UserDoc);
  },

  async update(id: string, data: Partial<Pick<User, 'firstName' | 'lastName' | 'bio'>>): Promise<User | null> {
    const doc = await UserModel.findByIdAndUpdate(id, data, { new: true }).lean<UserDoc>();

    return doc ? toUser(doc) : null;
  },

  async verifyUser(id: string): Promise<boolean> {
    const result = await UserModel.updateOne({ _id: id, isVerified: false }, { $set: { isVerified: true }, $unset: { expiresAt: '' } });

    return result.modifiedCount > 0;
  },
};
