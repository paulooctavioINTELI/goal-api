"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const userController = async (fastify) => {
    fastify.post('/users', {
        schema: {
            body: {
                type: 'object',
                required: ['phoneNumber'],
                properties: {
                    phoneNumber: { type: 'string' },
                },
            },
        },
        handler: async (request, reply) => {
            const { phoneNumber } = request.body;
            const user = await prisma.user.create({
                data: { phoneNumber },
            });
            reply.send(user);
        },
    });
};
exports.userController = userController;
