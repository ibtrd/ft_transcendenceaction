const jwt_secret = process.env.JWT_SECRET;
if (!jwt_secret) {
  console.error("Missing environment variable: JWT_SECRET");
  process.exit(1);
}

import Fastify from "fastify";
const fastify = Fastify();

import fastifyCookie from '@fastify/cookie';
fastify.register(fastifyCookie, {
  secret: 'my-secret', // Optional: for signing cookies
});

import fastifyJWT from "@fastify/jwt";
fastify.register(fastifyJWT, {
  secret: jwt_secret
})

import fastifyFormbody from "@fastify/formbody";
fastify.register(fastifyFormbody);

import routes from "./routes.js";
fastify.register(routes)

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
