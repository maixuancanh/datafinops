import type { Principal } from '@datafinops/auth';
import { AuthorizationError } from '@datafinops/auth';
import type { FastifyInstance, FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    principal?: Principal;
  }
}

export async function registerAuthPlugin(
  app: FastifyInstance,
  resolveBearer: (token: string, request: FastifyRequest) => Promise<Principal | undefined>,
): Promise<void> {
  app.addHook('onRequest', async (request, reply) => {
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) {
      return reply.code(401).send({
        type: 'urn:datafinops:authentication-required',
        title: 'Authentication required',
        status: 401,
        correlationId: request.id,
      });
    }
    const principal = await resolveBearer(authorization.slice('Bearer '.length), request);
    if (!principal) {
      return reply.code(401).send({
        type: 'urn:datafinops:invalid-identity',
        title: 'Invalid identity',
        status: 401,
        correlationId: request.id,
      });
    }
    request.principal = principal;
  });
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AuthorizationError) {
      return reply.code(error.statusCode).send({
        type: 'urn:datafinops:authorization-denied',
        title: error.message,
        status: error.statusCode,
        correlationId: request.id,
        reasonCodes: [error.reasonCode],
      });
    }
    return reply.send(error);
  });
}
