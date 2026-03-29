import bcrypt from 'bcryptjs';
import { usersRepository } from '../repositories/users.repository';
import { sessionsRepository } from '../repositories/sessions.repository';
import { User } from '../types';
import { UserRole } from '../enums/user-role.enum';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';

const BCRYPT_ROUNDS = 12;

export const authService = {
  async register(data: RegisterInput): Promise<{ user: User; sessionId: string }> {
    const existing = await usersRepository.findByEmail(data.email);
    if (existing) throw { statusCode: 409, message: 'Email already in use' };

    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    const user = await usersRepository.create({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: UserRole.User,
    });

    const sessionId = await sessionsRepository.create(user.id);

    return { user, sessionId };
  },

  async login(data: LoginInput): Promise<{ user: User; sessionId: string }> {
    const record = await usersRepository.findByEmailWithPasswordHash(data.email);
    if (!record) throw { statusCode: 401, message: 'Invalid credentials' };

    const valid = await bcrypt.compare(data.password, record.passwordHash);
    if (!valid) throw { statusCode: 401, message: 'Invalid credentials' };

    const sessionId = await sessionsRepository.create(record.id);
    const { passwordHash: _, ...user } = record;

    return { user, sessionId };
  },

  async logout(sessionId: string): Promise<void> {
    await sessionsRepository.delete(sessionId);
  },
};
