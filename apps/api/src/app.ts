import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import mercurius from 'mercurius';
import { db } from './plugins/db';
import { sessionPlugin } from './plugins/session';
import { authController, booksController, sseController, usersController } from './controllers';
import { schema, booksResolver, statsResolver, userBookResolver } from './graphql';

const resolvers = {
  Query: {
    ...booksResolver.Query,
    ...statsResolver.Query,
    ...userBookResolver.Query,
  },
  Mutation: {
    ...userBookResolver.Mutation,
  },
};

export const buildApp = async (app: FastifyInstance): Promise<void> => {
  await app.register(cors, { origin: true, credentials: true });
  await app.register(rateLimit, { global: false });
  await app.register(db);
  await app.register(cookie);
  await app.register(sessionPlugin);

  // GraphQL — registered before the Zod validator compiler so mercurius's own
  // JSON-Schema body validation is unaffected by Zod
  await app.register(mercurius, {
    schema,
    resolvers,
    graphiql: true,
    context: (req) => ({ user: req.user }),
  });

  // SSE — no body validation needed
  await app.register(sseController, { prefix: '/api' });

  // REST routes in an encapsulated scope with the Zod validator/serializer.
  // Fastify encapsulation ensures setValidatorCompiler here doesn't leak
  // into the mercurius route registered above.
  await app.register(
    async (rest) => {
      rest.setValidatorCompiler(validatorCompiler);
      rest.setSerializerCompiler(serializerCompiler);

      await rest.register(authController, { prefix: '/auth' });
      await rest.register(usersController, { prefix: '/users' });
      await rest.register(booksController, { prefix: '/books' });
    },
    { prefix: '/api' },
  );

  app.setErrorHandler((error, _req, reply) => {
    const err = error as { statusCode?: number; message?: string };
    const statusCode = err.statusCode ?? 500;
    reply.status(statusCode).send({ error: err.message ?? 'Internal Server Error' });
  });
};
