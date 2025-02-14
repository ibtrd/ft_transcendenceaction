import Fastify from "fastify";
const fastify = Fastify();

import fastifyFormbody from "@fastify/formbody";
fastify.register(fastifyFormbody);

import accountsRoutes from "./routes/accounts.js";
fastify.register(accountsRoutes, { prefix: "/v1/accounts"})

import passwordRoutes from "./routes/password.js";
fastify.register(passwordRoutes, { prefix: "/v1/password"})

// import googleRoutes from "./routes/google.js";
// fastify.register(googleRoutes, { prefix: "/v1/google"})

import fortytwoRoutes from "./routes/fortytwo.js";
fastify.register(fortytwoRoutes, { prefix: "/v1/fortytwo"})

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
