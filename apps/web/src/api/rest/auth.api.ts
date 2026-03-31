import http from './client';
import type { User, RegisterDto, LoginDto } from '@/types';

export const authApi = {
  async register(dto: RegisterDto): Promise<User> {
    const { data } = await http.post<User>('/api/auth/register', dto);
    return data;
  },

  async login(dto: LoginDto): Promise<User> {
    const { data } = await http.post<User>('/api/auth/login', dto);
    return data;
  },

  async logout(): Promise<void> {
    await http.post('/api/auth/logout');
  },

  async me(): Promise<User> {
    const { data } = await http.get<User>('/api/auth/me');
    return data;
  },

  async sendVerificationEmail(email: string): Promise<void> {
    await http.post('/api/auth/send-verification-email', { email });
  },

  async verifyUser(userId: string): Promise<void> {
    await http.get(`/api/auth/verify/${userId}`);
  },
};
