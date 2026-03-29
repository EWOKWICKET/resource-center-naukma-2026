import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import mercurius from 'mercurius';
import { db } from './plugins/db';
import { booksController, categoriesController, sseController } from './controllers';
import { schema, booksResolver, categoriesResolver, statsResolver } from './graphql';

const resolvers = {
  Query: {
    ...booksResolver.Query,
    ...categoriesResolver.Query,
    ...statsResolver.Query,
  },
  Book: booksResolver.Book,
};

export const buildApp = async (app: FastifyInstance): Promise<void> => {
  await app.register(cors, { origin: true, credentials: true });
  await app.register(db);

  // GraphQL — registered before the Zod validator compiler so mercurius's own
  // JSON-Schema body validation is unaffected by Zod
  await app.register(mercurius, {
    schema,
    resolvers,
    graphiql: true,
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

      await rest.register(booksController, { prefix: '/books' });
      await rest.register(categoriesController, { prefix: '/categories' });
    },
    { prefix: '/api' },
  );

  app.setErrorHandler((error, _req, reply) => {
    const err = error as { statusCode?: number; message?: string };
    const statusCode = err.statusCode ?? 500;
    reply.status(statusCode).send({ error: err.message ?? 'Internal Server Error' });
  });
};
