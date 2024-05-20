import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import { habitController } from './controllers/habitController';
import { userController } from './controllers/userController';

const fastify = Fastify();

fastify.register(multipart);

fastify.register(habitController);
fastify.register(userController);


fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
