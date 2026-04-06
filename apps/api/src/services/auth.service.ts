import bcrypt from 'bcryptjs';
import { usersRepository } from '../repositories/users.repository';
import { sessionsRepository } from '../repositories/sessions.repository';
import { mailService } from './mail.service';
import { User } from '../types';
import { UserRole } from '../enums/user-role.enum';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';

const BCRYPT_ROUNDS = 12;
const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export const authService = {
  async register(data: RegisterInput): Promise<User> {
    const existing = await usersRepository.findByEmail(data.email);
    if (existing) throw { statusCode: 409, message: 'Email already in use' };

    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    const user = await usersRepository.create({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: UserRole.User,
      isVerified: false,
      expiresAt: new Date(Date.now() + VERIFICATION_TTL_MS),
    });

    const link = `${process.env.FRONTEND_URL}/verify/${user.id}`;
    mailService
      .sendMail(
        user.email,
        'Verify your email',
        `<p>Click the link below to verify your email address. The link expires in 24 hours.</p><p><a href="${link}">${link}</a></p>`,
      )
      .catch((err) => console.error('[mail] Failed to send verification email:', err));

    return user;
  },

  async login(data: LoginInput): Promise<{ user: User; sessionId: string }> {
    const record = await usersRepository.findByEmailWithPasswordHash(data.email);
    if (!record) throw { statusCode: 401, message: 'Invalid credentials' };

    const valid = await bcrypt.compare(data.password, record.passwordHash);
    if (!valid) throw { statusCode: 401, message: 'Invalid credentials' };

    if (!record.isVerified) throw { statusCode: 403, message: 'Email not verified' };

    const sessionId = await sessionsRepository.create(record.id);
    const { passwordHash: _, ...user } = record;

    return { user, sessionId };
  },

  async logout(sessionId: string): Promise<void> {
    await sessionsRepository.delete(sessionId);
  },

  async sendVerificationEmail(email: string): Promise<void> {
    const user = await usersRepository.findByEmail(email);
    if (!user) throw { statusCode: 404, message: 'User not found' };
    if (user.isVerified) throw { statusCode: 400, message: 'Already verified' };

    const link = `${process.env.FRONTEND_URL}/verify/${user.id}`;
    await mailService.sendMail(
      email,
      'Verify your email',
      `<p>Click the link below to verify your email address. The link expires in 24 hours.</p><p><a href="${link}">${link}</a></p>`,
    );
  },

  async verifyUser(userId: string): Promise<void> {
    const modified = await usersRepository.verifyUser(userId);
    if (!modified) throw { statusCode: 404, message: 'User not found or already verified' };
  },
};
