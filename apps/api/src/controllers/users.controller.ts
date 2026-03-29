import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { usersService } from '../services/users.service';
import { addToLibrarySchema, libraryBookParamsSchema, updateProfileSchema, userParamsSchema } from '../schemas/users.schema';
import { requireRole } from '../guards/require-role';
import { requireOwnerOrAdmin } from '../guards/require-owner-or-admin';
import { UserRole } from '../enums/user-role.enum';

const AUTH_GUARDS = [requireRole(UserRole.User, UserRole.Admin), requireOwnerOrAdmin];

export async function usersController(app: FastifyInstance): Promise<void> {
  const router = app.withTypeProvider<ZodTypeProvider>();

  router.get('/:id', { schema: { params: userParamsSchema }, preHandler: AUTH_GUARDS }, async (req) => {
    return usersService.findById(req.params.id);
  });

  router.put('/:id', { schema: { params: userParamsSchema, body: updateProfileSchema }, preHandler: AUTH_GUARDS }, async (req) => {
    return usersService.update(req.params.id, req.body);
  });

  router.get('/:id/library', { schema: { params: userParamsSchema }, preHandler: AUTH_GUARDS }, async (req) => {
    return usersService.getLibrary(req.params.id);
  });

  router.post(
    '/:id/library',
    { schema: { params: userParamsSchema, body: addToLibrarySchema }, preHandler: AUTH_GUARDS },
    async (req, reply) => {
      const entry = await usersService.addToLibrary(req.params.id, req.body.bookId);

      return reply.status(201).send(entry);
    },
  );

  router.delete('/:id/library/:bookId', { schema: { params: libraryBookParamsSchema }, preHandler: AUTH_GUARDS }, async (req, reply) => {
    await usersService.removeFromLibrary(req.params.id, req.params.bookId);

    return reply.status(204).send();
  });
}
