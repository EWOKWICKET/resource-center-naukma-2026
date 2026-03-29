import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole } from '../enums/user-role.enum';

export const requireOwnerOrAdmin = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
  if (!req.user) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
  const params = req.params as { id?: string };
  if (req.user.role !== UserRole.Admin && req.user.id !== params.id) {
    return reply.status(403).send({ error: 'Forbidden' });
  }
};
