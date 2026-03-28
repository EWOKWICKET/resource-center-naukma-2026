import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { categoriesService } from '../services/categories.service';
import { categoryInputSchema, categoryParamsSchema, categoryStatusSchema } from '../schemas/categories.schema';

export async function categoriesController(app: FastifyInstance): Promise<void> {
  const router = app.withTypeProvider<ZodTypeProvider>();

  router.get('/', async () => {
    return categoriesService.findAll();
  });

  router.get('/:id', { schema: { params: categoryParamsSchema } }, async (req) => {
    return categoriesService.findById(req.params.id);
  });

  router.post('/', { schema: { body: categoryInputSchema } }, async (req, reply) => {
    const category = categoriesService.create(req.body);

    return reply.status(201).send(category);
  });

  router.put('/:id', { schema: { params: categoryParamsSchema, body: categoryInputSchema } }, async (req) => {
    return categoriesService.update(req.params.id, req.body);
  });

  router.delete('/:id', { schema: { params: categoryParamsSchema } }, async (req, reply) => {
    categoriesService.delete(req.params.id);

    return reply.status(204).send();
  });

  router.patch('/:id/status', { schema: { params: categoryParamsSchema, body: categoryStatusSchema } }, async (req) => {
    return categoriesService.setStatus(req.params.id, req.body.isActive);
  });
}
