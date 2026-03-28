import { FastifyInstance } from 'fastify';
import { sseService } from '../services/sse.service';

export async function sseController(app: FastifyInstance): Promise<void> {
  app.get('/sse', (req, reply) => {
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    reply.raw.write(': connected\n\n');

    sseService.addClient(reply.raw);

    const ping = setInterval(() => {
      reply.raw.write(': ping\n\n');
    }, 25_000);

    req.socket.on('close', () => {
      clearInterval(ping);
      sseService.removeClient(reply.raw);
    });
  });
}
