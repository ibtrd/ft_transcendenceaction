import Fastify from "fastify";
const fastify = Fastify();

import fastifyFormbody from "@fastify/formbody";
fastify.register(fastifyFormbody);

import routes from "./routes.js";
fastify.register(routes);

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
