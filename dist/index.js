"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_multipart_1 = __importDefault(require("fastify-multipart"));
const habitController_1 = require("./controllers/habitController");
const userController_1 = require("./controllers/userController");
const server = (0, fastify_1.default)();
server.register(fastify_multipart_1.default);
server.register(habitController_1.habitController);
server.register(userController_1.userController);
server.listen(3000, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
