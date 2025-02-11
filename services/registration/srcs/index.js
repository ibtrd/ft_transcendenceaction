import Fastify from "fastify";
const fastify = Fastify();

import fastifyFormbody from "@fastify/formbody";
fastify.register(fastifyFormbody);

import passwordRoutes from "./password-auth/routes.js";
fastify.register(passwordRoutes, { prefix: "/v1/password"})

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
