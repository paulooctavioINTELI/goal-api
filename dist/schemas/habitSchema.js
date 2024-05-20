"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.habitSchema = void 0;
const zod_1 = require("zod");
exports.habitSchema = zod_1.z.object({
    userId: zod_1.z.number(),
    action: zod_1.z.string(),
    time: zod_1.z.string(), // ISO string
});
