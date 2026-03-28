import { FastifyInstance } from 'fastify';

export const buildApp = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/health', async () => {
    return { status: 'ok' };
  });
};
