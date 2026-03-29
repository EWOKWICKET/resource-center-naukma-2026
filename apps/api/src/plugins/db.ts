import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import { FastifyInstance } from 'fastify';

async function dbPlugin(app: FastifyInstance): Promise<void> {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/resource-center';

  await mongoose.connect(uri);
  app.log.info('MongoDB connected');

  app.addHook('onClose', async () => {
    await mongoose.disconnect();
    app.log.info('MongoDB disconnected');
  });
}

export const db = fp(dbPlugin, { name: 'db' });
