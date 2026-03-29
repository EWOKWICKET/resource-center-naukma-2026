import 'dotenv/config';
import Fastify from 'fastify';
import { buildApp } from './app';

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

const start = async (): Promise<void> => {
  const app = Fastify({ logger: true });

  await buildApp(app);

  try {
    await app.listen({ port: PORT, host: HOST });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
