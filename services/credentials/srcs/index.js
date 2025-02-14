import Fastify from "fastify";
const fastify = Fastify();

import swagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
async function setUpSwagger() {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "API de Bastien",
        description: "Documentation de mon API REST",
        version: "1.0.0",
      },
      servers: [{ url: "http://localhost:3000", description: "Credentials (Private)" }],
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: "/api-docs",
  });

}

if (process.env.NODE_ENV !== "production") {
  setUpSwagger();
}

import fastifyFormbody from "@fastify/formbody";
fastify.register(fastifyFormbody);

import accountsRoutes from "./routes.js";
fastify.register(accountsRoutes, { prefix: "/v1/accounts"})

import passwordRoutes from "./password/routes.js";
fastify.register(passwordRoutes, { prefix: "/v1/password"})

// import googleRoutes from "./routes/google.js";
// fastify.register(googleRoutes, { prefix: "/v1/google"})

import fortytwoRoutes from "./fortytwo/routes.js";
fastify.register(fortytwoRoutes, { prefix: "/v1/fortytwo"})

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
