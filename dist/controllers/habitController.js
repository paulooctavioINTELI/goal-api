"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.habitController = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const cloudinaryConfig_1 = require("../cloudinaryConfig");
const prisma = new client_1.PrismaClient();
const habitSchema = zod_1.z.object({
    userId: zod_1.z.number(),
    title: zod_1.z.string(),
});
const habitController = async (fastify) => {
    fastify.post('/habits', {
        schema: {
            body: {
                type: 'object',
                required: ['userId', 'title'],
                properties: {
                    userId: { type: 'number' },
                    title: { type: 'string' },
                },
            },
        },
        handler: async (request, reply) => {
            const { userId, title } = request.body;
            const habit = await prisma.habit.create({
                data: { userId, title },
            });
            reply.send(habit);
        },
    });
    fastify.post('/proof', async (request, reply) => {
        var _a, e_1, _b, _c;
        const parts = request.parts();
        let habitId;
        let proofUrl;
        try {
            for (var _d = true, parts_1 = __asyncValues(parts), parts_1_1; parts_1_1 = await parts_1.next(), _a = parts_1_1.done, !_a; _d = true) {
                _c = parts_1_1.value;
                _d = false;
                const part = _c;
                if (part.type === 'file') {
                    const uploadResult = await (0, cloudinaryConfig_1.uploadToCloudinary)(part);
                    proofUrl = uploadResult.secure_url;
                }
                else if (part.type === 'field' && part.fieldname === 'habitId') {
                    habitId = parseInt(part.value, 10);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = parts_1.return)) await _b.call(parts_1);
            }
            finally { if (e_1) throw e_1.error; }
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
    fastify.post('/votes', {
        handler: async (request, reply) => {
            const { habitId, userId, valid } = request.body;
            const vote = await prisma.vote.create({
                data: { habitId, userId, valid },
            });
            reply.send(vote);
        },
    });
    fastify.get('/votes/:habitId', {
        handler: async (request, reply) => {
            const { habitId } = request.params;
            const votes = await prisma.vote.findMany({
                where: { habitId: parseInt(habitId, 10) },
            });
            reply.send(votes);
        },
    });
};
exports.habitController = habitController;
