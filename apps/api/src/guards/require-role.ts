import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole } from '../enums/user-role.enum';

export const requireRole = (...roles: UserRole[]) => {
  return async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!req.user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
    if (!roles.includes(req.user.role)) {
      return reply.status(403).send({ error: 'Forbidden' });
    }
  };
};
