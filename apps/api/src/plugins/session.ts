import '@fastify/cookie';
import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { sessionsRepository } from '../repositories/sessions.repository';
import { usersRepository } from '../repositories/users.repository';

async function session(app: FastifyInstance): Promise<void> {
  app.addHook('preHandler', async (req) => {
    const sid = req.cookies?.sid as string | undefined;
    if (!sid) return;

    const session = await sessionsRepository.findBySessionId(sid);
    if (!session) return;

    const user = await usersRepository.findById(session.userId);
    if (user) req.user = user;
  });
}

export const sessionPlugin = fp(session, { name: 'session', dependencies: ['db'] });
