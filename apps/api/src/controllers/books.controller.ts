import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { booksService } from '../services/books.service';
import { bookInputSchema, bookParamsSchema, booksQuerySchema, bookStatusSchema } from '../schemas/books.schema';
import { requireRole } from '../guards/require-role';
import { UserRole } from '../enums/user-role.enum';
import type { BookFilters } from '../types';

export async function booksController(app: FastifyInstance): Promise<void> {
  const router = app.withTypeProvider<ZodTypeProvider>();

  router.get('/', { schema: { querystring: booksQuerySchema } }, async (req) => {
    const isAdmin = req.user?.role === UserRole.Admin;
    const filters: BookFilters = isAdmin ? req.query : { ...req.query, isActive: true };

    return booksService.findAll(filters);
  });

  router.get('/:id', { schema: { params: bookParamsSchema } }, async (req) => {
    return booksService.findById(req.params.id);
  });

  router.post('/', { schema: { body: bookInputSchema }, preHandler: [requireRole(UserRole.Admin)] }, async (req, reply) => {
    const book = await booksService.create(req.body);

    return reply.status(201).send(book);
  });

  router.put(
    '/:id',
    { schema: { params: bookParamsSchema, body: bookInputSchema }, preHandler: [requireRole(UserRole.Admin)] },
    async (req) => {
      return booksService.update(req.params.id, req.body);
    },
  );

  router.delete('/:id', { schema: { params: bookParamsSchema }, preHandler: [requireRole(UserRole.Admin)] }, async (req, reply) => {
    await booksService.delete(req.params.id);

    return reply.status(204).send();
  });

  router.patch(
    '/:id/status',
    { schema: { params: bookParamsSchema, body: bookStatusSchema }, preHandler: [requireRole(UserRole.Admin)] },
    async (req) => {
      return booksService.setStatus(req.params.id, req.body.isActive);
    },
  );
}
