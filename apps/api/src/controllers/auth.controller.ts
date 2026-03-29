import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authService } from '../services/auth.service';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { requireRole } from '../guards/require-role';
import { UserRole } from '../enums/user-role.enum';

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
};

export async function authController(app: FastifyInstance): Promise<void> {
  const router = app.withTypeProvider<ZodTypeProvider>();

  router.post('/register', { schema: { body: registerSchema } }, async (req, reply) => {
    const { user, sessionId } = await authService.register(req.body);
    reply.setCookie('sid', sessionId, COOKIE_OPTS);

    return reply.status(201).send(user);
  });

  router.post('/login', { schema: { body: loginSchema } }, async (req, reply) => {
    const { user, sessionId } = await authService.login(req.body);
    reply.setCookie('sid', sessionId, COOKIE_OPTS);

    return user;
  });

  router.post('/logout', async (req, reply) => {
    const sid = req.cookies?.sid;
    if (sid) await authService.logout(sid);
    reply.clearCookie('sid', { path: '/' });

    return reply.status(204).send();
  });

  router.get('/me', { preHandler: [requireRole(UserRole.User, UserRole.Admin)] }, async (req) => {
    return req.user;
  });
}
