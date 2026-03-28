import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { booksService } from '../services/books.service';
import { bookInputSchema, bookParamsSchema, booksQuerySchema, bookStatusSchema } from '../schemas/books.schema';

export async function booksController(app: FastifyInstance): Promise<void> {
  const router = app.withTypeProvider<ZodTypeProvider>();

  router.get('/', { schema: { querystring: booksQuerySchema } }, async (req) => {
    return booksService.findAll(req.query);
  });

  router.get('/:id', { schema: { params: bookParamsSchema } }, async (req) => {
    return booksService.findById(req.params.id);
  });

  router.post('/', { schema: { body: bookInputSchema } }, async (req, reply) => {
    const book = booksService.create(req.body);

    return reply.status(201).send(book);
  });

  router.put('/:id', { schema: { params: bookParamsSchema, body: bookInputSchema } }, async (req) => {
    return booksService.update(req.params.id, req.body);
  });

  router.delete('/:id', { schema: { params: bookParamsSchema } }, async (req, reply) => {
    booksService.delete(req.params.id);

    return reply.status(204).send();
  });

  router.patch('/:id/status', { schema: { params: bookParamsSchema, body: bookStatusSchema } }, async (req) => {
    return booksService.setStatus(req.params.id, req.body.isActive);
  });
}
