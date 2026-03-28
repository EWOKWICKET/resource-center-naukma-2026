import Fastify from 'fastify';
import { buildApp } from './app';

const start = async (): Promise<void> => {
  const fastify = Fastify({ logger: true });

  await buildApp(fastify);

  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
