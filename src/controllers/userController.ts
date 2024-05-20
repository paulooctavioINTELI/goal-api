import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { userSchema, UserSchema } from '../schemas/userSchema';

const prisma = new PrismaClient();

export const userController = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: UserSchema }>('/users', {
    schema: { 
      body: {
        type: 'object',
        required: ['phoneNumber'],
        properties: {
          phoneNumber: { type: 'string' },
        },
      },
    },
    handler: async (request: FastifyRequest<{ Body: UserSchema }>, reply: FastifyReply) => {
      const { phoneNumber } = request.body;
      const user = await prisma.user.create({
        data: { phoneNumber },
      });
      reply.send(user);
    },
  });
};
