import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { uploadToCloudinary } from '../cloudinaryConfig';

const prisma = new PrismaClient();

export const habitController = async (fastify: FastifyInstance) => {
  // Criação de um novo hábito
  fastify.post<{ Body: { userId: number, title: string, voters: number[] } }>('/habits', async (request, reply) => {
    const { userId, title, voters } = request.body;
    const habit = await prisma.habit.create({
      data: { userId, title, voters },
    });
    reply.send(habit);
  });

  // Upload de prova para um hábito
  fastify.post('/proof', async (request: FastifyRequest, reply: FastifyReply) => {
    const parts = request.parts();
    let habitId: number | undefined;
    let proofUrl: string | undefined;

    for await (const part of parts) {
      if (part.type === 'file') {
        const uploadResult: any = await uploadToCloudinary(part.file);
        proofUrl = uploadResult.secure_url;
      } else if (part.type === 'field' && part.fieldname === 'habitId') {
        habitId = parseInt(part.value as string, 10);
      }
    }

    if (habitId === undefined || proofUrl === undefined) {
      return reply.status(400).send({ error: 'Missing habitId or proof image' });
    }

    const habit = await prisma.habit.update({
      where: { id: habitId },
      data: { proofUrl, status: 'submitted' },
    });

    reply.send(habit);
  });

  // Votação sobre a prova de um hábito
  fastify.post<{ Body: { habitId: number, userId: number, valid: boolean } }>('/votes', async (request, reply) => {
    const { habitId, userId, valid } = request.body;
    await prisma.vote.create({
      data: { habitId, userId, valid },
    });

    const votes = await prisma.vote.findMany({
      where: { habitId }
    });
    const totalVotes = votes.length;
    const positiveVotes = votes.filter(vote => vote.valid).length;
    const habit = await prisma.habit.findUnique({
      where: { id: habitId }
    });

    if (habit && positiveVotes === habit.voters.length) {
      // Se todos os votos forem positivos, exclua o hábito
      await prisma.habit.delete({ where: { id: habitId } });
      reply.send({ message: 'Habit approved and deleted' });
    } else if (totalVotes === habit?.voters.length) {
      // Se houver votos negativos, notifique o usuário e não exclua o hábito
      // Lógica de notificação do usuário (por exemplo, enviar notificação)
      reply.send({ message: 'Habit proof rejected by voters' });
    } else {
      reply.send({ message: 'Vote recorded' });
    }
  });

  // Listar hábitos pendentes de voto para um usuário específico
  fastify.get<{ Params: { userId: string } }>('/pending-votes/:userId', async (request, reply) => {
    const { userId } = request.params;
    const habits = await prisma.habit.findMany({
      where: {
        voters: {
          has: parseInt(userId, 10)
        }
      }
    });
    reply.send(habits);
  });
};
