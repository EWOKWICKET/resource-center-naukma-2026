import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { loginSchema, registerSchema, sendVerificationEmailSchema } from '../schemas/auth.schema';
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

  router.post(
    '/register',
    { config: { rateLimit: { max: 5, timeWindow: '1 minute' } }, schema: { body: registerSchema } },
    async (req, reply) => {
      const user = await authService.register(req.body);

      return reply.status(201).send(user);
    },
  );

  router.post(
    '/login',
    { config: { rateLimit: { max: 10, timeWindow: '1 minute' } }, schema: { body: loginSchema } },
    async (req, reply) => {
      const { user, sessionId } = await authService.login(req.body);
      reply.setCookie('sid', sessionId, COOKIE_OPTS);

      return user;
    },
  );

  router.post('/logout', async (req, reply) => {
    const sid = req.cookies?.sid;
    if (sid) await authService.logout(sid);
    reply.clearCookie('sid', { path: '/' });

    return reply.status(204).send();
  });

  router.post(
    '/send-verification-email',
    { config: { rateLimit: { max: 3, timeWindow: '5 minutes' } }, schema: { body: sendVerificationEmailSchema } },
    async (req, reply) => {
      await authService.sendVerificationEmail(req.body.email);

      return reply.status(200).send();
    },
  );

  // TODO: replace userId with a one-time opaque token to hide user identity
  router.get('/verify/:userId', { schema: { params: z.object({ userId: z.string() }) } }, async (req, reply) => {
    await authService.verifyUser(req.params.userId);

    return reply.status(200).send();
  });

  router.get('/me', { preHandler: [requireRole(UserRole.User, UserRole.Admin)] }, async (req) => {
    return req.user;
  });
}
