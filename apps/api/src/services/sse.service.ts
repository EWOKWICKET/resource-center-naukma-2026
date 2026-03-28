import { ServerResponse } from 'http';

class SseService {
  private readonly clients = new Set<ServerResponse>();

  addClient(res: ServerResponse): void {
    this.clients.add(res);
  }

  removeClient(res: ServerResponse): void {
    this.clients.delete(res);
  }

  emit(event: string, data: unknown): void {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    this.clients.forEach((client) => {
      client.write(message);
    });
  }

  get clientCount(): number {
    return this.clients.size;
  }
}

// singleton shared across services
export const sseService = new SseService();
